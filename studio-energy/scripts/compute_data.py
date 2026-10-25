"""Numerics for The Energy Budget. Writes src/data/numerics.json.

    uv run --with numpy python scripts/compute_data.py

N1  random sign walks (cold open, chapter 1)
N2  Möbius and Mertens values to 1200 (chapter 1)
N3  the family A_u(D) itself, at D = 2000, over every row 0 < N(u) <= D^1.1
N4  copies: A_{p^6}(D) - A_1(D) for small primary primes p, computed directly
N5  sextic Gauss sums gamma_j(p) as walks, and a check of the identity
    mu(n) gamma_{-1}(n) = chi_n(-1) G(n)^{-1} conj(alpha(n)) gamma_2(n) at primes
N6  exponent arithmetic (the k-ladder, 11/12 + 5 theta/12)
N7  sieve exponents at the basic scales
N8  the recursion schedule

Conventions are the October manuscript's (§2.2, §2.3): O = Z[omega], an
element a + b·omega is the pair (a, b); primary means = 1 mod 3; chi_n(u) =
(u/n)_6, the sextic residue symbol, zero when (u, n) != 1; e(z) =
exp(4 pi i Im z / sqrt 3); gamma_j(n) = N(n)^{-1/2} sum_{x mod n} chi_n(x)^j e(x/n).
nu is trivial and S is the set of primes above 2 and 3.
"""

import json
import math
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'data' / 'numerics.json'

OMEGA = complex(-0.5, math.sqrt(3) / 2)
ZETA6 = 1 + OMEGA  # e^{i pi/3}


def norm(a, b):
    return a * a - a * b + b * b


def window(y):
    """A smooth bump W supported in [1/2, 2], W(1) = 1."""
    y = np.asarray(y, dtype=float)
    t = np.log(np.clip(y, 1e-12, None)) / math.log(2)
    out = np.zeros_like(t)
    inside = np.abs(t) < 1
    out[inside] = np.exp(1 - 1 / (1 - t[inside] ** 2))
    return out


def spf_table(n):
    s = list(range(n + 1))
    for p in range(2, int(n ** 0.5) + 1):
        if s[p] == p:
            for k in range(p * p, n + 1, p):
                if s[k] == k:
                    s[k] = p
    return s


def factor(n, spf):
    out = {}
    while n > 1:
        p = spf[n]
        out[p] = out.get(p, 0) + 1
        n //= p
    return out


def divides(d, x):
    """d | x in O, for pairs (a, b)."""
    (c, e), (a, b) = d, x
    n = norm(c, e)
    # x * conj(d), conj(c + e w) = (c - e) - e w
    cc, ce = c - e, -e
    p = a * cc - b * ce
    q = a * ce + b * cc - b * ce
    return p % n == 0 and q % n == 0


def primary_prime_of_split(q):
    """The two primary primes of norm q (q = 1 mod 3)."""
    out = []
    r = int(math.isqrt(4 * q)) + 2
    for b in range(-r, r + 1):
        if b % 3:
            continue
        for a in range(-r, r + 1):
            if a % 3 == 1 and norm(a, b) == q:
                out.append((a, b))
    assert len(out) == 2, (q, out)
    return out


# ---------------------------------------------------------------------------
# The ring of residues mod a primary prime, vectorized over many u.

class Residues:
    """O/(pi) for a primary prime pi, with chi_pi as an exponent of zeta_6."""

    def __init__(self, pi):
        a, b = pi
        self.pi = pi
        N = norm(a, b)
        if b == 0:  # inert: pi = -q, O/(q) = F_q[omega], order q^2
            q = -a
            assert q > 0 and q % 3 == 2 and N == q * q
            self.kind, self.q, self.order = 'inert', q, q * q
        else:
            q = N
            # omega = -a / b mod pi, since a + b omega = 0 mod pi
            w = (-a * pow(b, -1, q)) % q
            assert (w * w + w + 1) % q == 0
            self.kind, self.q, self.order, self.w = 'split', q, q, w
        self.e = (self.order - 1) // 6
        # images of zeta_6^k = (1 + omega)^k
        self.units = []
        x = (1, 0)
        for k in range(6):
            self.units.append(self.reduce1(*x))
            x = (x[0] - x[1], x[0])  # times (1 + omega): (a + b w)(1 + w) = (a - b) + a w
        assert len(set(self.units)) == 6

    def reduce1(self, a, b):
        if self.kind == 'split':
            return (a + b * self.w) % self.q
        return (a % self.q, b % self.q)

    def chi(self, A, B):
        """Exponent k with chi_pi(u) = zeta_6^k, or -1 where pi | u."""
        q = self.q
        A = np.asarray(A, dtype=np.int64)
        B = np.asarray(B, dtype=np.int64)
        out = np.full(A.shape, -1, dtype=np.int8)
        if self.kind == 'split':
            x = (A + B * self.w) % q
            r = np.ones_like(x)
            base, e = x.copy(), self.e
            while e:
                if e & 1:
                    r = (r * base) % q
                base = (base * base) % q
                e >>= 1
            for k, v in enumerate(self.units):
                out[(r == v) & (x != 0)] = k
        else:
            x0, x1 = A % q, B % q
            r0, r1 = np.ones_like(x0), np.zeros_like(x1)
            b0, b1, e = x0.copy(), x1.copy(), self.e
            mul = lambda p0, p1, s0, s1: ((p0 * s0 - p1 * s1) % q, (p0 * s1 + p1 * s0 - p1 * s1) % q)
            while e:
                if e & 1:
                    r0, r1 = mul(r0, r1, b0, b1)
                b0, b1 = mul(b0, b1, b0, b1)
                e >>= 1
            for k, (v0, v1) in enumerate(self.units):
                out[(r0 == v0) & (r1 == v1) & ((x0 != 0) | (x1 != 0))] = k
        zero = self._divisible(A, B)
        assert np.all((out >= 0) | zero), 'symbol not a sixth root'
        out[zero] = -1
        return out

    def _divisible(self, A, B):
        if self.kind == 'split':
            return (A + B * self.w) % self.q == 0
        return (A % self.q == 0) & (B % self.q == 0)


# ---------------------------------------------------------------------------
# Columns: primary squarefree n prime to 6, with their prime factors.

def columns(nmax, spf):
    """Primary n with N(n) <= nmax, odd norm, squarefree; returns list of
    (a, b, N, mu, primes) with primes the primary prime factors."""
    split_cache = {}
    out = []
    r = int(math.isqrt(4 * nmax // 3)) + 3
    for b in range(-r, r + 1):
        if b % 3:
            continue
        for a in range(-r, r + 1):
            if a % 3 != 1:
                continue
            N = norm(a, b)
            if N == 0 or N > nmax or N % 2 == 0:
                continue
            f = factor(N, spf)
            primes, ok = [], True
            for q, v in f.items():
                if q % 3 == 2:  # inert, norm q^2
                    if v != 2:
                        ok = False
                        break
                    primes.append((-q, 0))
                else:  # split, q = pi pi-bar
                    if q not in split_cache:
                        split_cache[q] = primary_prime_of_split(q)
                    if v > 2:
                        ok = False
                        break
                    hits = [p for p in split_cache[q] if divides(p, (a, b))]
                    if v == 1:
                        assert len(hits) == 1
                        primes.append(hits[0])
                    else:  # v == 2: pi pi-bar is squarefree, pi^2 is not
                        if len(hits) == 2 and a % q == 0 and b % q == 0:
                            primes.extend(hits)
                        else:
                            ok = False
                            break
            if ok:
                out.append((a, b, N, (-1) ** len(primes), primes))
    return out


# ---------------------------------------------------------------------------

def n1_walks():
    rng = np.random.default_rng(20261025)
    walks, steps = 4000, 1000
    signs = rng.choice([-1, 1], size=(walks, steps))
    paths = np.cumsum(signs, axis=1)
    final = paths[:, -1]
    running = np.cumsum(final.astype(float) ** 2) / np.arange(1, walks + 1)
    shown = 24  # paths kept for drawing, every 10th step
    return {
        'steps': steps,
        'walks': walks,
        'seed': 20261025,
        'final': final.tolist(),
        'running_mean_sq': [round(x, 2) for x in running.tolist()],
        'mean_sq': round(float(np.mean(final.astype(float) ** 2)), 2),
        'paths': [[0] + paths[i, 9::10].tolist() for i in range(shown)],
        'first_path': [0] + paths[0].tolist(),
    }


def mobius_upto(n):
    mu = [1] * (n + 1)
    mu[0] = 0
    is_p = [True] * (n + 1)
    for p in range(2, n + 1):
        if is_p[p]:
            for k in range(p, n + 1, p):
                if k > p:
                    is_p[k] = False
                mu[k] = -mu[k]
            for k in range(p * p, n + 1, p * p):
                mu[k] = 0
    return mu


def n2_mertens(nmax=1200):
    mu = mobius_upto(nmax)
    m, total = [], 0
    for k in range(1, nmax + 1):
        total += mu[k]
        m.append(total)
    return {'mobius': mu[1:], 'mertens': m}


def n3_family(D=2000, theta=0.1):
    H = D ** (1 + theta)
    spf = spf_table(2 * D + 10)
    cols = [c for c in columns(2 * D, spf) if D / 2 < c[2] < 2 * D]
    weights = np.array([c[3] * float(window(c[2] / D)) for c in cols])
    # rows: all u in O with 0 < N(u) <= H
    r = int(math.isqrt(int(4 * H / 3))) + 2
    A, B = np.meshgrid(np.arange(-r, r + 1), np.arange(-r, r + 1), indexing='ij')
    A, B = A.ravel(), B.ravel()
    Nu = norm(A, B)
    keep = (Nu > 0) & (Nu <= H)
    A, B, Nu = A[keep], B[keep], Nu[keep]
    primes = sorted({p for c in cols for p in c[4]}, key=lambda p: norm(*p))
    table = {p: Residues(p).chi(A, B) for p in primes}
    zeta = ZETA6 ** np.arange(6)
    total = np.zeros(A.shape, dtype=complex)
    for (a, b, N, mu, ps), w in zip(cols, weights):
        k = np.zeros(A.shape, dtype=np.int16)
        zero = np.zeros(A.shape, dtype=bool)
        for p in ps:
            t = table[p]
            zero |= t < 0
            k += np.where(t < 0, 0, t)
        total += np.where(zero, 0, w * zeta[k % 6])
    sizes = np.abs(total)
    energy = float(np.sum(sizes ** 2))
    one = (A == 1) & (B == 0)
    mass = float(np.sum(weights ** 2))
    # the trivial check: chi_n(1) = 1, so A_1(D) is the plain weighted Möbius sum
    a1 = float(np.sum(weights))
    assert abs(total[one][0] - a1) < 1e-9
    # every symbol is multiplicative in u: spot-check chi_p(u v) = chi_p(u) chi_p(v)
    p0 = primes[len(primes) // 2]
    R = Residues(p0)
    x = R.chi(np.array([2, 5]), np.array([1, -3]))
    uv = (2 * 5 - 1 * -3, 2 * -3 + 1 * 5 - 1 * -3)
    assert R.chi(np.array([uv[0]]), np.array([uv[1]]))[0] == (x[0] + x[1]) % 6
    order = np.argsort(-sizes)
    top = sizes[order[0]]
    return {
        'D': D,
        'theta': theta,
        'H': round(H, 1),
        'rows': int(A.size),
        'columns': len(cols),
        'primes_used': len(primes),
        'column_mass': round(mass, 3),
        'energy': round(energy, 1),
        'DH': round(D * H, 1),
        'energy_over_DH': round(energy / (D * H), 4),
        'energy_over_random': round(energy / (A.size * mass), 4),
        'A1': round(a1, 3),
        'A1_abs': round(abs(a1), 3),
        'sqrtD': round(math.sqrt(D), 3),
        'rms': round(math.sqrt(energy / A.size), 3),
        'max_row': {'a': int(A[order[0]]), 'b': int(B[order[0]]), 'size': round(float(top), 3)},
        'max_over_rms': round(float(top) / math.sqrt(energy / A.size), 3),
        'trivial_bound': round(float(np.sum(np.abs(weights))), 3),
        'copies_inside': 7 ** 6 <= H,
        'Y': round(H ** (1 / 6), 3),
        # every row, for the field figure: a, b and |A_u(D)|
        'grid_a': A.tolist(),
        'grid_b': B.tolist(),
        'grid_size': [round(float(s), 3) for s in sizes],
        'histogram': np.histogram(sizes, bins=30, range=(0, float(np.ceil(top))))[0].tolist(),
        'histogram_max': float(np.ceil(top)),
    }


def n4_copies(Ds=(2000, 5000, 10000, 20000)):
    spf = spf_table(2 * max(Ds) + 10)
    cols = columns(2 * max(Ds), spf)
    norms = [7, 13, 19, 31, 37, 43]
    ps = {q: primary_prime_of_split(q)[0] for q in norms}
    out = []
    for D in Ds:
        inside = [c for c in cols if D / 2 < c[2] < 2 * D]
        w = {(a, b): mu * float(window(N / D)) for a, b, N, mu, _ in inside}
        a1 = sum(w.values())
        rows = []
        for q in norms:
            p = ps[q]
            diff = -sum(v for (a, b), v in w.items() if divides(p, (a, b)))
            count = sum(1 for (a, b) in w if divides(p, (a, b)))
            rows.append({'norm': q, 'p': list(p), 'diff': round(diff, 3), 'terms': count, 'D_over_N': round(D / q, 1)})
        out.append({'D': D, 'A1': round(a1, 3), 'terms': len(inside), 'copies': rows})
    return {'norms': norms, 'by_D': out}


def gauss(pi, j):
    """gamma_j(pi) for a primary prime pi, and its walk over x = 0..q-1 (split)."""
    R = Residues(pi)
    a, b = pi
    q = R.q
    if R.kind != 'split':
        raise ValueError('walks drawn for split primes only')
    xs = np.arange(q)
    k = R.chi(xs, np.zeros_like(xs))
    vals = np.where(k < 0, 0, ZETA6 ** ((j * k.astype(int)) % 6))
    # e(x/pi) = exp(-2 pi i x b / q) for rational x
    steps = vals * np.exp(-2j * math.pi * xs * b / q)
    walk = np.concatenate([[0], np.cumsum(steps)]) / math.sqrt(q)
    return complex(walk[-1]), walk


def n5_gauss():
    out = []
    for q in [7, 13, 19, 31, 37, 43, 61, 67, 73, 79, 97]:
        for pi in primary_prime_of_split(q):
            R = Residues(pi)
            g = {j: gauss(pi, j)[0] for j in (-1, 1, 2, 3)}
            chi_m1 = ZETA6 ** R.chi(np.array([-1]), np.array([0]))[0]
            chi_4 = ZETA6 ** R.chi(np.array([4]), np.array([0]))[0]
            G = np.conj(chi_4) * g[3]
            alpha = complex(pi[0] + pi[1] * OMEGA)
            alpha /= abs(alpha)
            lhs = -g[-1]  # mu(pi) = -1
            rhs = chi_m1 / G * np.conj(alpha) * g[2]
            out.append({
                'q': q, 'p': list(pi),
                'abs': [round(abs(g[j]), 6) for j in (-1, 2)],
                'identity_error': float(abs(lhs - rhs)),
            })
    walks = {}
    for q in [13, 31]:
        pi = primary_prime_of_split(q)[0]
        for j in (-1, 2):
            end, w = gauss(pi, j)
            walks[f'{q}:{j}'] = {'p': list(pi), 'j': j, 'end': [end.real, end.imag], 'path': [[z.real, z.imag] for z in w]}
    return {'checks': out, 'walks': walks, 'identity_holds': all(c['identity_error'] < 1e-9 for c in out)}


def n6_exponents():
    ladder = {}
    for theta in (0.1, 0.05, 0.0):
        ladder[str(theta)] = {k: 0.5 * (1 + (1 + theta) * (1 - 1 / k)) for k in range(1, 13)}
    assert abs(ladder['0.1'][6] - (11 / 12 + 5 * 0.1 / 12)) < 1e-12
    return {'ladder': ladder, 'eleven_twelfths_curve': [[t / 1000, 11 / 12 + 5 * t / 12000] for t in range(0, 101)]}


def n7_sieve(theta=0.1):
    rows = 1 - theta  # script H = D^{1 - theta}
    cols = 1 - 2 * theta  # dual columns: script H^2 / X at X = D
    return {'theta': theta, 'rows': rows, 'columns': cols, 'rows_plus_columns': max(rows, cols), 'extra': 2 / 3 * (rows + cols)}


def n8_schedule(theta=0.1):
    e, out = 1 - theta, []
    while e > 0:
        out.append(round(e, 6))
        e -= 2 * theta
    out.append(round(max(e, 0), 6))
    return {'theta': theta, 'row_exponents': out}


def main():
    data = {
        'walks': n1_walks(),
        **n2_mertens(),
        'family': n3_family(),
        'copies': n4_copies(),
        'gauss': n5_gauss(),
        'exponents': n6_exponents(),
        'sieve': n7_sieve(),
        'schedule': n8_schedule(),
        'source': 'scripts/compute_data.py',
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, separators=(',', ':')))
    fam = data['family']
    print('walks: mean of squares', data['walks']['mean_sq'], 'over', data['walks']['walks'], 'walks of', data['walks']['steps'])
    print('family:', {k: v for k, v in fam.items() if not k.startswith('grid') and k != 'histogram'})
    for row in data['copies']['by_D']:
        print('copies D =', row['D'], 'A1', row['A1'], 'terms', row['terms'], [(c['norm'], c['diff'], c['terms']) for c in row['copies']])
    print('gauss identity holds:', data['gauss']['identity_holds'], max(c['identity_error'] for c in data['gauss']['checks']))
    print('sieve', data['sieve'], 'schedule', data['schedule'])
    print('wrote', OUT, OUT.stat().st_size // 1024, 'KiB')


if __name__ == '__main__':
    main()
