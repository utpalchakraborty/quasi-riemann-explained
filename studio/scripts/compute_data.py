"""Numerical data drawn in the film. Every plotted value comes from here.

Run: uv run --with mpmath python scripts/compute_data.py
"""
import json
from pathlib import Path

import mpmath as mp

OUT = Path(__file__).resolve().parents[1] / 'src' / 'data'
mp.mp.dps = 20


def mobius_upto(n):
    mu = [1] * (n + 1)
    mu[0] = 0
    is_prime = [True] * (n + 1)
    for p in range(2, n + 1):
        if is_prime[p]:
            for k in range(2 * p, n + 1, p):
                is_prime[k] = False
            for k in range(p, n + 1, p):
                mu[k] *= -1
            for k in range(p * p, n + 1, p * p):
                mu[k] = 0
    return mu


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    zeros = [float(mp.im(mp.zetazero(k))) for k in range(1, 81)]

    n_max = 1200
    mu = mobius_upto(n_max)
    mertens, total = [], 0
    for n in range(1, n_max + 1):
        total += mu[n]
        mertens.append(total)

    # |zeta(sigma + i t)| on the window drawn as a landscape.
    sigmas = [-0.2 + i * 0.01 for i in range(0, 141)]   # -0.2 .. 1.2
    ts = [8 + j * 0.08 for j in range(0, 401)]          # 8 .. 40
    mp.mp.dps = 15
    landscape = [[round(float(abs(mp.zeta(mp.mpc(s, t)))), 5) for s in sigmas] for t in ts]

    data = {
        'zeta_zero_heights': zeros,
        'mobius': mu[1:],
        'mertens': mertens,
        'landscape': {'sigma': sigmas, 't': ts, 'abs_zeta': landscape},
        'source': 'mpmath %s, computed by scripts/compute_data.py' % mp.__version__,
    }
    (OUT / 'numerics.json').write_text(json.dumps(data))
    print('zeros', zeros[:5], '...', zeros[-1])
    print('M(x): max', max(mertens), 'min', min(mertens), 'M(1200)', mertens[-1])
    flat = [v for row in landscape for v in row]
    print('|zeta| window min %.4f max %.3f' % (min(flat), max(flat)))


if __name__ == '__main__':
    main()
