# Decentralized LB/UB Table

## Notation

### Objective functions, accuracy, and stochastic model

\(F\) denotes global objective, \(F(x)=N^{-1}\sum_{i=1}^N F_i(x)\); \(F_i\) denotes local objective at node \(i\); \(F^\star\) denotes optimal value, \(F^\star=\inf_x F(x)\); \(\eps\) denotes target accuracy, \(\eps>0\); \(\E\) denotes expectation operator; \(\sigma^2\) denotes stochastic-gradient variance bound, \(\E\|g_i(x;\xi_i)-\nabla F_i(x)\|^2\le\sigma^2\); \(g_i(x;\xi_i)\) denotes the stochastic first-order oracle output at node \(i\), evaluated at \(x\) using local random sample \(\xi_i\); \(\sigma\) denotes standard-deviation bound, \(\sigma=\sqrt{\sigma^2}\); \(\zeta_{\rm stat}^2\) denotes uniform cross-node gradient-heterogeneity bound satisfying \(N^{-1}\sum_{i=1}^N\|\nabla F_i(x)-\nabla F(x)\|^2\le\zeta_{\rm stat}^2\) for all \(x\) [[49]](#ref-arxiv-2412-07252); \(\delta_{\rm ht}\) denotes failure probability in a high-probability guarantee, \(\delta_{\rm ht}\in(0,1)\) [[11]](#ref-arxiv-2006-08085).

### Problem geometry and parameters

\(\Delta\) denotes initial optimality gap, \(\Delta=F(x^0)-F^\star\); \(\Delta_0\) denotes initial objective-gap bound, \(\Delta_0\ge F(x^0)-F^\star\) [[28]](#ref-arxiv-2210-03232) [[42]](#ref-arxiv-1912-12110) [[12]](#ref-arxiv-2606-04757); \(N\) denotes number of nodes; \(T\) denotes iteration horizon; \(T_{\rm out}\) denotes outer-iteration horizon when each outer step contains a local batch or multiple gossip rounds; \(K_{\rm loc}\) denotes number of local component functions, where \(f_{ij}\) is component \(j\) at node \(i\) and \(F_i(x)=K_{\rm loc}^{-1}\sum_{j=1}^{K_{\rm loc}}f_{ij}(x)\); \(S\) denotes epoch index [[33]](#ref-arxiv-2112-10389); \(L\) denotes smoothness constant satisfying \(\|\nabla F_i(x)-\nabla F_i(y)\|\le L\|x-y\|\) for every node \(i\); \(\bar L\) denotes mean-squared component smoothness constant satisfying \((N K_{\rm loc})^{-1}\sum_{i=1}^N\sum_{j=1}^{K_{\rm loc}}\|\nabla f_{ij}(x)-\nabla f_{ij}(y)\|^2\le \bar L^2\|x-y\|^2\) [[9]](#ref-arxiv-2210-13931) [[10]](#ref-arxiv-2408-09775); \(\mu\) denotes strong-convexity constant satisfying \(h(y)\ge h(x)+\langle g,y-x\rangle+\frac{\mu}{2}\|y-x\|^2\) for \(g\in\partial h(x)\); \(\kappa\) denotes condition number, \(\kappa=L/\mu\); \(\kappa_s\) denotes mean-squared finite-sum condition number, \(\kappa_s=\bar L/\mu\) [[9]](#ref-arxiv-2210-13931) [[23]](#ref-arxiv-2402-02490); \(\kappa_{s,\rm VR}\) denotes VR-EXTRA/DIGing stochastic condition number, \(\kappa_{s,\rm VR}=\mu^{-1}\max_i K_{\rm loc}^{-1}\sum_{j=1}^{K_{\rm loc}}L_{ij}\), where \(L_{ij}\) is the smoothness constant of component \(j\) at node \(i\) [[21]](#ref-arxiv-2009-04373); \(q_{\rm DPS}\) denotes DPSVRG constant satisfying \(q_{\rm DPS}<1\) [[33]](#ref-arxiv-2112-10389); \(M\) denotes uniform local subgradient bound satisfying \(\|g_i(x)\|\le M\) for every \(g_i(x)\in\partial F_i(x)\); \(R\) denotes initial-distance bound satisfying \(\|x^0-x^\star\|\le R\); \(c\) denotes initial error constant in the primal-dual PL bound [[42]](#ref-arxiv-1912-12110); \(\alpha_{\rm DSP}\) denotes positive constant [[47]](#ref-arxiv-1911-12665); \(\ell_{\rm DSP}\) denotes D-SPIDER-SFO complexity coefficient [[47]](#ref-arxiv-1911-12665); \(C_{\rm DDA}\) denotes DDA constant coefficient [[39]](#ref-arxiv-2211-06914); \(C_2\) denotes DAGP heterogeneity coefficient [[28]](#ref-arxiv-2210-03232); \(\bar\zeta\) denotes root-mean-square local-gradient heterogeneity at a global optimum, \(\bar\zeta=(N^{-1}\sum_{i=1}^N\|\nabla F_i(x^\star)\|^2)^{1/2}\) [[45]](#ref-arxiv-2003-10422); \(p\) denotes higher-order smoothness degree, an integer \(p\ge2\) such that \(\|\mathcal D^pF_i(X)-\mathcal D^pF_i(Y)\|_*\le L_{p,*}\|X-Y\|\) for some \(L_{p,*}>0\), where \(\mathcal D^p\) is the \(p\)-th derivative [[40]](#ref-arxiv-2510-01377); \(\Psi^0\) denotes initial MG-Skip Lyapunov value [[24]](#ref-arxiv-2312-11861); \(C_0\) denotes DAGP initialization coefficient.

### Topology, network, and constraints

\(\kappa_A\) denotes equilibrium skewness of row-stochastic matrix \(A\), \(\kappa_A=\max_i(\pi_A)_i/\min_i(\pi_A)_i\) [[48]](#ref-arxiv-2506-04600); \(\kappa_\pi\) denotes equilibrium skewness of column-stochastic matrix \(W_\pi\), \(\kappa_\pi=\max_i\pi_i/\min_i\pi_i\) [[7]](#ref-arxiv-2312-04928); \(\rho\) denotes spectral gap, \(\rho=1-\|W-N^{-1}\mathbf 1_N\mathbf 1_N^\top\|_2\); \(\rho_{\rm K}\) denotes reference-specific spectral gap, \(\rho_{\rm K}=1-\lambda_2(P)\), for the fixed symmetric doubly stochastic gossip matrix \(P\), where \(\lambda_2(P)\) is the second-largest eigenvalue of \(P\) [[12]](#ref-arxiv-2606-04757); \(\beta_{\rm H}\) denotes one-step mixing factor satisfying \(\|W^t-N^{-1}\mathbf 1_N\mathbf 1_N^\top\|_2\le\beta_{\rm H}<1\) [[8]](#ref-arxiv-2211-00533); \(\beta_A\) denotes row-stochastic mixing factor of \(A\), \(\beta_A=\|A-\mathbf 1_N\pi_A^\top\|_{\pi_A}\in[0,1)\), where \(\Pi_A=\operatorname{diag}(\pi_A)\) and \(\|B\|_{\pi_A}:=\|\Pi_A^{1/2}B\Pi_A^{-1/2}\|_2\) is the induced weighted matrix norm [[48]](#ref-arxiv-2506-04600); \(\beta_\pi\) denotes column-stochastic mixing factor of \(W_\pi\), \(\beta_\pi=\|W_\pi-\pi\mathbf 1_N^\top\|_\pi\in[0,1)\), where \(\Pi=\operatorname{diag}(\pi)\) and \(\|B\|_\pi:=\|\Pi^{-1/2}B\Pi^{1/2}\|_2\) is the induced weighted matrix norm [[7]](#ref-arxiv-2312-04928); \(\delta_{\rm net}\) denotes normalized network contraction rate, \(\delta_{\rm net}:=p_{\rm mix}/\tau_{\rm mix}\), where \(1-p_{\rm mix}\) is the \(\tau_{\rm mix}\)-step expected squared-consensus-error factor [[45]](#ref-arxiv-2003-10422); \(W\) denotes doubly stochastic mixing matrix \(W\in\mathbb R^{N\times N}\) satisfying \(W\mathbf 1_N=\mathbf 1_N\) and \(\mathbf 1_N^\top W=\mathbf 1_N^\top\); \(\omega(\widehat W)\) denotes smallest positive eigenvalue of the positive semidefinite gossip/Laplacian operator \(\widehat W\) [[13]](#ref-arxiv-2004-02635); \(C_{\mathbf S}\) denotes DAGP network-and-algorithm factor satisfying \(C_{\mathbf S}>-\lambda_{\min}(\mathbf S)\), where \(\mathbf S\) is the theorem matrix determined by the gossip matrices and algorithm parameters [[28]](#ref-arxiv-2210-03232); \(W_\pi\) denotes primitive column-stochastic mixing matrix satisfying \(\mathbf 1_N^\top W_\pi=\mathbf 1_N^\top\) [[7]](#ref-arxiv-2312-04928); \(\pi\) denotes normalized positive right Perron vector of \(W_\pi\), satisfying \(W_\pi\pi=\pi\) and \(\mathbf 1_N^\top\pi=1\) [[7]](#ref-arxiv-2312-04928); \(\pi_A\) denotes normalized positive left Perron vector of row-stochastic \(A\), satisfying \(\pi_A^\top A=\pi_A^\top\) and \(\pi_A^\top\mathbf 1_N=1\) [[48]](#ref-arxiv-2506-04600); \(p_{\rm mix}\) denotes blockwise expected consensus-contraction amount in the definition of \(\delta_{\rm net}\) [[45]](#ref-arxiv-2003-10422); \(\tau_{\rm AC}\) denotes AC-GT mixing-window coefficient, \(\tau_{\rm AC}=\eta_{\rm AC}\bar\tau d_{\mathcal G}\), where \(\bar\tau\) is the joint-connectivity window, \(d_{\mathcal G}\) is the graph diameter, and \(\eta_{\rm AC}\in\mathbb N\) satisfies the cited block-contraction condition [[19]](#ref-arxiv-2309-02626).

### Iterates and outputs

\(x_i\) denotes local iterate/output at node \(i\); \(x_i^t\) is its value at iteration \(t\), while the unindexed form is the theorem's returned output; \(\bar x\) denotes network-average iterate/output, \(\bar x^t=N^{-1}\sum_{i=1}^N x_i^t\); the unindexed \(\bar{x}\) denotes the averaged output specified by the cited theorem; \(x_{o,i}\) denotes output selected by node \(i\) from its internal memory [[4]](#ref-arxiv-2405-18031); \(x_o^T\) denotes network-average output, \(x_o^T=N^{-1}\sum_{i=1}^N x_{a,i}^T\), where \(x_{a,i}^T\) is node \(i\)'s component of the averaged primal vector \(x_a^T\) [[4]](#ref-arxiv-2405-18031); \(\bar x_{i,T}\) denotes time-averaged output at node \(i\), \(\bar x_{i,T}=T^{-1}\sum_{t=0}^{T-1}x_i^t\) [[28]](#ref-arxiv-2210-03232); \(\bar y_T\) denotes averaged primal output after \(T\) iterations [[30]](#ref-arxiv-2312-15845); \(\hat x_i(T)\) denotes time-averaged output at node \(i\), \(\hat x_i(T)=T^{-1}\sum_{t=1}^T x_i^t\) [[31]](#ref-arxiv-1005-2012); \(\tilde x_i^T\) denotes time-averaged output at node \(i\), \(\tilde x_i^T=T^{-1}\sum_{t=1}^T x_i^t\) [[32]](#ref-arxiv-2506-12901); \(\hat x\) denotes the algorithm output used to evaluate the accuracy criterion in the corresponding source; its specific construction follows the theorem cited in that row [[9]](#ref-arxiv-2210-13931) [[8]](#ref-arxiv-2211-00533) [[6]](#ref-arxiv-2210-07863) [[10]](#ref-arxiv-2408-09775) [[11]](#ref-arxiv-2006-08085) [[22]](#ref-arxiv-1910-04057) [[23]](#ref-arxiv-2402-02490) [[27]](#ref-arxiv-1904-09015) [[41]](#ref-arxiv-2110-01594) [[50]](#ref-arxiv-2406-01484); \(\hat y\) denotes tuple of node-wise time-averaged outputs [[34]](#ref-arxiv-1411-4186); \(\tilde x\) denotes virtual centralized output after epoch \(S\) in DPSVRG [[33]](#ref-arxiv-2112-10389); \(\tilde x_i\) denotes weighted time-averaged output at node \(i\), \(\tilde x_i=A_T^{-1}\sum_{t=1}^T a_t x_i^t\), where \(A_T=\sum_{t=1}^T a_t\) and \(a_t>0\) are theorem-specified averaging weights [[26]](#ref-arxiv-2106-14075) [[35]](#ref-arxiv-1806-07081); \(x^\star\) denotes optimizer of \(F\), \(x^\star\in\arg\min_x F(x)\); \(X\) denotes stacked local iterate/output, \(X^t=[(x_1^t)^\top,\ldots,(x_N^t)^\top]^\top\); the unindexed form is the returned stacked output; \(X^\star\) denotes stacked consensus optimizer, \(X^\star=\mathbf 1_N\otimes x^\star\); \(y\) denotes consensus auxiliary primal iterate in DDA, \(y^t=\nabla d^*(-\bar z^t)\), where \(d^*\) is the conjugate of the prox function [[39]](#ref-arxiv-2211-06914); \(\mathbf y\) denotes stacked auxiliary iterate in DDA, \(\mathbf y^t=\mathbf 1_N\otimes y^t\) [[39]](#ref-arxiv-2211-06914); \(z\) denotes node-wise dual accumulator \(z_i^t\) in DDA [[39]](#ref-arxiv-2211-06914); \(\bar z\) denotes network-average auxiliary iterate, \(\bar z^t=N^{-1}\sum_{i=1}^N z_i^t\) [[39]](#ref-arxiv-2211-06914); \(z_{\rm VR}^k\) denotes VR-EXTRA/DIGing auxiliary primal iterate returned at iteration \(k\) [[21]](#ref-arxiv-2009-04373); \(\bar x_u^k\) denotes left-Perron-weighted aggregate \(\bar x_u^k=N^{-1}(u^\top\otimes I)X^k\), where \(u^\top R=u^\top\) and \(u^\top\mathbf 1_N=N\) [[37]](#ref-arxiv-2601-03566); \(\bar x_{\pi_{\rm SAB}}^k\) denotes S-AB Perron-weighted aggregate \(\bar x_{\pi_{\rm SAB}}^k=(\pi_{\rm SAB}^\top\otimes I)X^k\), where \(\pi_{\rm SAB}\) is the normalized positive left Perron vector of its row-stochastic mixing matrix [[44]](#ref-arxiv-2109-07981); \(\bar x_{\pi_A}^t\) denotes row-stochastic Perron-weighted aggregate \(\bar x_{\pi_A}^t=(\pi_A^\top\otimes I)X^t\) [[48]](#ref-arxiv-2506-04600).

### Targets and stationarity measures

\(\delta_{\rm G}\) denotes Goldstein-stationarity radius; \(G\) denotes Bregman distance of the stacked separable objective, \(G(X,X^\star)=\sum_{i=1}^N[F_i(X_i)-F_i(x^\star)-\langle\nabla F_i(x^\star),X_i-x^\star\rangle]\), where \(X_i\) is node \(i\)'s block of \(X\) [[5]](#ref-arxiv-1910-10666); \(\mathbf s\) denotes proximal-gradient mapping of \(F+h\), \(\mathbf s(x)=\alpha^{-1}[x-\operatorname{prox}_{\alpha h}(x-\alpha\nabla F(x))]\), where \(h\) is the convex regularizer and \(\alpha>0\) [[41]](#ref-arxiv-2110-01594); \(G_a\) denotes DDA gradient mapping, \(G_a(x,z)=a^{-1}[\nabla d^*(-z)-\nabla d^*(-z-\nabla f(x))]\) [[39]](#ref-arxiv-2211-06914); \(\bar g\) denotes node-averaged local gradient at the stacked iterate, \(\bar g(X)=N^{-1}\sum_{i=1}^N\nabla F_i(X_i)\) [[40]](#ref-arxiv-2510-01377); \(\nabla F\) denotes gradient of the global objective; \(\|\cdot\|\) denotes Euclidean norm of \(v\in\mathbb R^d\), \(\|v\|=(\sum_{r=1}^d v_r^2)^{1/2}\); \(\|\nabla F(\hat x)\|_{\delta_{\rm G}}\) denotes Goldstein stationarity measure with radius \(\delta_{\rm G}\); \(\|\cdot\|_*\) denotes nuclear norm of a matrix \(X\), \(\|X\|_* =\sum_r\sigma_r(X)\) [[40]](#ref-arxiv-2510-01377); \(\|\cdot\|_{\E}\) denotes root-mean-square norm of a random vector \(v\), \(\|v\|_{\mathbb E}=(\mathbb E\|v\|^2)^{1/2}\) [[39]](#ref-arxiv-2211-06914); \(\|\cdot\|_F\) denotes Frobenius norm of \(X\in\mathbb R^{a\times b}\), \(\|X\|_F=(\sum_{r=1}^a\sum_{s=1}^b X_{rs}^2)^{1/2}\); \(V^t\) denotes source-defined primal-dual Lyapunov value combining squared primal error, squared dual error, and gradient-estimator variance [[13]](#ref-arxiv-2004-02635); \(\mathcal E_{\rm obj}\) denotes average local-objective error, \(\mathcal E_{\rm obj}(y_1,\ldots,y_N)=N^{-1}\sum_{i=1}^N F_i(y_i)-F^\star\) [[34]](#ref-arxiv-1411-4186).

### Asymptotic notation

\(O(\cdot)\) denotes asymptotic upper bound, \(a=O(b)\) when \(a\le Cb\) for a constant \(C>0\); \(\Omega(\cdot)\) denotes asymptotic lower bound, \(a=\Omega(b)\) when \(a\ge cb\) for a constant \(c>0\); \(\widetilde O(\cdot)\) denotes asymptotic upper bound hiding poly-logarithmic factors, \(a=\widetilde O(b)\).

### Indices and algorithmic parameters

\(i\) denotes node index; \(j\) denotes local component index; \(t\) denotes iteration index; \(\eta\) denotes positive stepsize [[19]](#ref-arxiv-2309-02626) [[37]](#ref-arxiv-2601-03566); \(\theta\) denotes linear contraction parameter \(\theta\in(0,1)\) in the factor \((1-\theta)^t\) [[42]](#ref-arxiv-1912-12110); \(\eta_{\rm alg}\) denotes positive DAGP auxiliary parameter [[28]](#ref-arxiv-2210-03232); \(p_{\rm comm}\) denotes communication probability, \(p_{\rm comm}\in(0,1]\) [[24]](#ref-arxiv-2312-11861); \(w_t\) denotes positive theorem weights used to average strongly-convex decentralized-SGD objective errors [[45]](#ref-arxiv-2003-10422); \(W_T\) denotes cumulative weight, \(W_T=\sum_{t=0}^T w_t\) [[45]](#ref-arxiv-2003-10422); \(s\) denotes candidate iteration index in \(\min_{1\le s\le t}\); \(\alpha_{\rm DAGP}\) denotes DAGP gradient stepsize, \(\alpha_{\rm DAGP}>0\).

## Tags

### Fixed scope

Every row in the current Decentralized Optimization release assumes peer-to-peer gossip, synchronous communication rounds, and no communication compression. These fixed attributes are omitted from the row labels; the structured problem tags retain them for taxonomy and audit purposes.

### Objective form

`SUM` denotes a deterministic distributed aggregate \(F(x)=\frac{1}{N}\sum_{i=1}^{N}F_i(x)\), where each local objective \(F_i\) is deterministic. A `SUM`+`SFO` row is used when the deterministic local objective is accessed by a sampled oracle: either explicit finite-sum component sampling or an unbiased noisy-gradient oracle for \(F_i\); oracle-only stochasticity is disclosed by a Remark marker. `STO` denotes an expectation objective \(F(x)=\frac{1}{N}\sum_{i=1}^{N}\mathbb{E}_{\xi_i}[f_i(x;\xi_i)]\), where \(\xi_i\) is a local random sample and the objective is accessed through sampled stochastic first-order information. Thus `SUM`/`STO` describes the objective model, whereas the oracle tag below describes what one local query returns.

### Geometry and regularity

`SC` means strong convexity with parameter \(\mu>0\); `C` means convexity without an assumed positive strong-convexity parameter; `NC` means that convexity is not assumed; and `PL` means the classical differentiable Polyak-Lojasiewicz condition \(\frac12\|\nabla F(x)\|^2\geq\mu(F(x)-F^\star)\). The classification follows the level used by the cited statement (global objective, local objectives, or both), with stronger local assumptions retained as caveats. `SM` means differentiability with an \(L\)-Lipschitz gradient at the theorem's stated level; `NS` means that the total objective is not assumed differentiable with an \(L\)-Lipschitz gradient and the result instead uses nonsmooth first-order, subgradient, or proximal information. `COMP` marks a composite objective consisting of a smooth loss and an explicit nonsmooth/proximable regularizer; it supplements rather than replaces `NS`.

### Local oracle

`FO` is an exact local first-order oracle (the exact gradient in the smooth case, or the exact first-order mapping specified by the paper); `SFO` is a sampled stochastic or finite-sum component oracle returning \(g_i(x;\xi_i)\) under the cited theorem's bias, variance, and independence assumptions; and `SUBG` is a deterministic local subgradient oracle returning \(g_i(x)\in\partial F_i(x)\). All displayed complexities count per-node local oracle calls, not total calls summed over the network. `PROX` means that the algorithm additionally assumes exact evaluation of the regularizer's proximal operator; these side-access calls are not included in the displayed `FO`/`SFO` counts.

### Network evolution

`STAT` means that one communication graph and its mixing operator remain fixed over the run. `TV` means that the graph or mixing operator may vary by communication round, subject to the connectivity and mixing assumptions stated by the cited theorem.

| No. | Problem Type | Measure | Lower Bound | Upper Bound | Status | Reference (LB) | Reference (UB) |
|---:|---|---|---|---|---|---|---|
| 1 | `SUM SC SM FO TV`<sup>[S12](#remark-S12)</sup> | \(F(x_i)-F^\star \le \eps\)<sup>[M3](#remark-M3)</sup> | \(\Omega(\sqrt{\kappa} \log(1/\eps))\) | \(O(\sqrt{\kappa}\log(1/\eps))\)<sup>[N2](#remark-N2), [N1](#remark-N1)</sup> | `EXACT` | [[1]](#ref-arxiv-2106-04469), Theorem 3 | [[1]](#ref-arxiv-2106-04469), Theorem 6 |
| 2 | `SUM C NS SUBG STAT` | \(F(\bar x)-F^\star \le \eps\) | \(\Omega(M^2 R^2 / \eps^2)\)<sup>[A10](#remark-A10), [A11](#remark-A11)</sup> | \(O(M^2 R^2 / \eps^2)\)<sup>[A10](#remark-A10)</sup> | `EXACT` | [[2]](#ref-arxiv-1806-00291), Theorem 3 | [[2]](#ref-arxiv-1806-00291), Theorem 5 |
| 3 | `SUM SC SM FO STAT`<sup>[S16](#remark-S16)</sup> | \(F(x_i)-F^\star \le \eps, \forall i\) | \(\Omega(\sqrt{\kappa} \log(1/\eps))\)<sup>[O3](#remark-O3)</sup> | \(O(\sqrt{\kappa} \log(1/\eps))\)<sup>[O3](#remark-O3)</sup> | `COND` | [[3]](#ref-arxiv-1702-08704), Theorem 2 | [[3]](#ref-arxiv-1702-08704), Theorem 4 |
| 4 | `SUM SC NS SUBG TV`<sup>[S12](#remark-S12), [S13](#remark-S13)</sup> | \(F(x_{o,i})-F^\star\le\eps_{\rm LB};\allowbreak F(x_o^T)-F^\star\le\eps_{\rm UB}\)<sup>[M4](#remark-M4)</sup> | \(\Omega(M^2/(\mu \eps))\) | \(O(M^2/(\mu \eps))\) | `COND` | [[4]](#ref-arxiv-2405-18031), Theorem 1 | [[4]](#ref-arxiv-2405-18031), Theorem 3 |
| 5 | `SUM C SM FO STAT`<sup>[S12](#remark-S12)</sup> | \(G(X,X^\star) \le \eps\)<sup>[M1](#remark-M1)</sup> | \(\Omega(\sqrt{LR^2/\eps}+R \sqrt{N}\,\bar\zeta/\eps)\) | \(O(\sqrt{LR^2/\eps}+R \sqrt{N}\,\bar\zeta/\eps)\)<sup>[A9](#remark-A9)</sup> | `COND` | [[5]](#ref-arxiv-1910-10666), Theorem 2; Corollary 3 | [[5]](#ref-arxiv-1910-10666), Theorem 7 |
| 6 | `SUM C NS SUBG TV`<sup>[S12](#remark-S12), [S13](#remark-S13)</sup> | \(F(x_{o,i})-F^\star\le\eps_{\rm LB};\allowbreak F(x_o^T)-F^\star\le\eps_{\rm UB}\)<sup>[M4](#remark-M4)</sup> | \(\Omega(M^2 R^2 / \eps^2)\) | \(O(M^2 R^2 / \eps^2)\) | `COND` | [[4]](#ref-arxiv-2405-18031), Theorem 2 | [[4]](#ref-arxiv-2405-18031), Theorem 4 |
| 7 | `STO NC SM SFO STAT`<sup>[S3](#remark-S3)</sup> | \(\E\|\nabla F(\hat x)\|^2\le\eps_{\rm LB};\allowbreak \frac1{T_{\rm out}}\sum_{t=1}^{T_{\rm out}}\E\|\nabla F(\bar x^{(t)})\|^2\le\eps_{\rm UB}\)<sup>[M5](#remark-M5)</sup> | \(\Omega(\Delta L \sigma^2/(N \eps^2) + \Delta L/(\sqrt{\rho} \eps))\) | \(\widetilde O(\Delta L \sigma^2/(N \eps^2) + \Delta L/(\sqrt{\rho} \eps))\)<sup>[A3](#remark-A3)</sup> | `COND` | [[6]](#ref-arxiv-2210-07863), Table 6 | [[6]](#ref-arxiv-2210-07863), Theorem 4 |
| 8 | `STO NC SM SFO STAT`<sup>[S11](#remark-S11), [S14](#remark-S14)</sup> | \(\frac1{T_{\rm out}+1}\sum_{t=0}^{T_{\rm out}}\E\|\nabla F(\bar x^{(t)})\|^2\le\eps\) | \(\Omega(\sigma^2L\Delta/(N\eps^2)+(1+\log\kappa_\pi)L\Delta/((1-\beta_\pi)\eps))\)<sup>[G7](#remark-G7)</sup> | \(\widetilde O(\sigma^2L\Delta/(N\eps^2)+(1+\log\kappa_\pi)L\Delta/((1-\beta_\pi)\eps))\)<sup>[N3](#remark-N3)</sup> | `COND` | [[7]](#ref-arxiv-2312-04928), Theorem 1; Equation (11) | [[7]](#ref-arxiv-2312-04928), Equation (14) |
| 9 | `STO NC SM SFO TV`<sup>[S2](#remark-S2), [S4](#remark-S4), [S13](#remark-S13)</sup> | \(\E\|\nabla F(\hat x)\|^2\le\eps_{\rm LB};\allowbreak \frac1{T+1}\sum_{k=0}^T\E\|\nabla F(\bar x^{(k)})\|^2\le\eps_{\rm UB}\) | \(\Omega(\Delta L \sigma^2/(N \eps^2) + \Delta L/((1-\beta_{\rm H})\eps))\)<sup>[O5](#remark-O5), [A8](#remark-A8), [N8](#remark-N8)</sup> | \(\widetilde O(\Delta L \sigma^2/(N \eps^2) + \Delta L/((1-\beta_{\rm H})\eps))\)<sup>[N8](#remark-N8)</sup> | `COND` | [[8]](#ref-arxiv-2211-00533), Theorem 4 | [[8]](#ref-arxiv-2211-00533), Theorem 6 |
| 10 | `SUM PL SM SFO STAT` | \(\E[F(x_i)-F^\star] \le \eps\) | \(\Omega(K_{\rm loc}+\min\{K_{\rm loc}\kappa,\sqrt{K_{\rm loc}/N}\kappa_s\}\log(1/\eps))\)<sup>[A12](#remark-A12), [N9](#remark-N9)</sup> | \(O((K_{\rm loc}+\min\{K_{\rm loc}\kappa,\sqrt{K_{\rm loc}/N}\kappa_s\})\log(\Delta/\eps))\)<sup>[N10](#remark-N10)</sup> | `LOG` | [[9]](#ref-arxiv-2210-13931), Theorem 7; Table 4 | [[9]](#ref-arxiv-2210-13931), Corollary 2; Table 4 |
| 11 | `SUM NC SM SFO STAT` | \(\E\|\nabla F(\hat x)\| \le \eps\) | \(\Omega(K_{\rm loc}+\min\{K_{\rm loc}L,\sqrt{K_{\rm loc}/N}\bar L\}\Delta/\eps^2)\)<sup>[N9](#remark-N9)</sup> | \(O(K_{\rm loc}^{1/2}\eps^{-2})\)<sup>[G8](#remark-G8)</sup> | `GAP` | [[9]](#ref-arxiv-2210-13931), Theorem 3; Table 2; Remark 9 | [[10]](#ref-arxiv-2408-09775), Theorem 5.5; Remark 5.6 |
| 12 | `STO NC SM SFO STAT`<sup>[S3](#remark-S3)</sup> | \(\E\|\nabla F(\hat x)\| \le \eps\) | \(\Omega(\Delta L\sigma^2/(N\eps^4))\)<sup>[N4](#remark-N4), [A8](#remark-A8)</sup> | \(\widetilde O(\Delta L\sigma^2/(N\eps^4)+\Delta L/(\sqrt{\rho}\eps^2))\)<sup>[N4](#remark-N4), [A2](#remark-A2)</sup> | `GAP` | [[11]](#ref-arxiv-2006-08085), Corollary 1 | [[11]](#ref-arxiv-2006-08085), Theorem 3 |
| 13 | `STO PL SM SFO STAT`<sup>[S3](#remark-S3)</sup> | \(\E[F(\hat x)-F^\star]\le\eps_{\rm LB};\allowbreak \frac1{T_{\rm out}}\sum_{t=1}^{T_{\rm out}}\E[F(\bar x^{(t)})-F^\star]\le\eps_{\rm UB}\)<sup>[M5](#remark-M5)</sup> | \(\Omega(\sigma^2/(\mu N \eps) + \sqrt{\kappa/\rho} \log(1/\eps))\) | \(\widetilde O(L \sigma^2/(\mu^2 N \eps) + \kappa/\sqrt{\rho} \log(1/\eps))\)<sup>[A3](#remark-A3)</sup> | `GAP` | [[6]](#ref-arxiv-2210-07863), Table 7 | [[6]](#ref-arxiv-2210-07863), Theorem 5 |
| 14 | `SUM C SM FO STAT`<sup>[S23](#remark-S23)</sup> | \(F(\bar x) - F^\star \le \eps\) | \(\Omega(\sqrt{L R^2/(\rho \eps)})\)<sup>[N7](#remark-N7)</sup> | Unknown | `UB?` | [[12]](#ref-arxiv-2606-04757), Theorem 2 and paragraph following the theorem | / |
| 15 | `SUM SC SM FO STAT` | \(\E V^t\le\eps\) | Unknown | \(O(\max(L/\mu, \|\widehat W\|/\omega(\widehat W)) \log(1/\eps))\)<sup>[A13](#remark-A13)</sup> | `LB?` | / | [[13]](#ref-arxiv-2004-02635), Appendix C, paragraph following Theorem C.1 |
| 16 | `SUM SC SM FO STAT`<sup>[S1](#remark-S1)</sup> | \(\|x_i - x^\star\|^2 \le \eps\) | Unknown | \(O(\log(1/\eps))\) | `LB?` | / | [[14]](#ref-arxiv-2308-08164), Theorem 1 |
| 17 | `SUM SC SM FO STAT` | \(\|x_i-x^\star\|^2 \le \eps\) | Unknown | \(O(\log(1/\eps))\)<sup>[A14](#remark-A14)</sup> | `LB?` | / | [[15]](#ref-arxiv-1803-09169), Theorem 2; Theorem 1 |
| 18 | `SUM SC SM FO TV`<sup>[S1](#remark-S1), [S15](#remark-S15)</sup> | \(\|X - X^\star\|^2 \le \eps\) | Unknown | \(O(\log(1/\eps))\)<sup>[G9](#remark-G9)</sup> | `LB?` | / | [[16]](#ref-arxiv-1810-07393), Theorem 1 |
| 19 | `SUM SC SM FO TV`<sup>[S24](#remark-S24)</sup> | \(\|X-X^\star\|^2 \le \eps\) | Unknown | \(O(\log(1/\eps))\)<sup>[G15](#remark-G15)</sup> | `LB?` | / | [[17]](#ref-arxiv-1611-00990), Theorem 4.1; Corollary 4.2 |
| 20 | `SUM SC SM FO TV` | \(\|X^T-X^\star\|_F^2 \le \eps\) | Unknown | \(O(\kappa \log(R^2 / \eps))\)<sup>[O6](#remark-O6)</sup> | `LB?` | / | [[18]](#ref-arxiv-1911-08527), Theorem 4.3 |
| 21 | `SUM SC SM FO TV` | \(\|\bar x_k-x^\star\|^2 \leq \eps\) | Unknown | \(O((L\tau_{\rm AC}^2/\mu)\log(1/\eps))\) | `LB?` | / | [[19]](#ref-arxiv-2309-02626), Theorem 3.1; Corollary 3.1 |
| 22 | `SUM SC SM SFO STAT`<sup>[S22](#remark-S22)</sup> | \(\E[F(x_i) - F^\star] \le \eps, \forall i\) | Unknown | \(\widetilde O(\sigma^2/(N\mu\eps)+\sqrt{L/(\mu\rho_{\rm K})}\log(\Delta_0/\eps))\)<sup>[A24](#remark-A24), [A25](#remark-A25), [G13](#remark-G13)</sup> | `LB?` | / | [[12]](#ref-arxiv-2606-04757), Theorem 5; Algorithm 4 |
| 23 | `SUM SC SM SFO STAT`<sup>[S1](#remark-S1), [S20](#remark-S20)</sup> | \(\E\|\bar x_k-x^\star\|^2\le\eps\) | Unknown | \(O(\eps^{-1})\)<sup>[G4](#remark-G4), [A19](#remark-A19)</sup> | `LB?` | / | [[20]](#ref-arxiv-2005-07785), Theorem 2; Section IV-B |
| 24 | `SUM SC SM SFO STAT` | \(\E\|z_{\rm VR}^k-x^\star\|^2 \le \eps\) | Unknown | \(O((\sqrt{K_{\rm loc}\kappa_{s,\rm VR}}+K_{\rm loc})\log(1/\eps))\) | `LB?` | / | [[21]](#ref-arxiv-2009-04373), Corollary 5 |
| 25 | `SUM SC SM SFO STAT` | \(\|\hat x-x^\star\|^2 \le \eps\) | Unknown | \(O((K_{\rm loc}+\kappa^2/\rho^2)\log(1/\eps))\)<sup>[G10](#remark-G10)</sup> | `LB?` | / | [[22]](#ref-arxiv-1910-04057), Theorems 1 and 2 |
| 26 | `SUM SC SM SFO TV` | \(\|X^T-X^\star\|^2 \le \eps\) | Unknown | \(O((K_{\rm loc}+\sqrt{K_{\rm loc}\kappa_s})\log(1/\eps))\) | `LB?` | / | [[23]](#ref-arxiv-2402-02490), Corollary 4.2; Table 2 |
| 27 | `SUM SC NS FO STAT COMP PROX`<sup>[S18](#remark-S18)</sup> | \(\E[\|X^t-X^\star\|_F^2] \le \eps\) | Unknown | \(O(\max\{\kappa,p_{\rm comm}^{-2}\} \log(\Psi^0/\eps))\)<sup>[O1](#remark-O1)</sup> | `LB?` | / | [[24]](#ref-arxiv-2312-11861), Theorem 1; Equation (11); following complexity paragraph; Table I |
| 28 | `SUM SC NS FO STAT COMP PROX` | \(\|X^T-X^\star\|^2 \le \eps\) | Unknown | \(O(\log(1/\eps))\)<sup>[O1](#remark-O1), [G11](#remark-G11)</sup> | `LB?` | / | [[25]](#ref-arxiv-1905-07996), Theorem 1 |
| 29 | `SUM SC NS FO TV COMP PROX` | \(\E[\|\tilde{x}_i - x^\star\|^2] \le \eps\) | Unknown | \(O(\log(1/\eps))\)<sup>[O1](#remark-O1)</sup> | `LB?` | / | [[26]](#ref-arxiv-2106-14075), Equation (21) |
| 30 | `SUM SC NS SUBG STAT` | \(F(\hat x)-F^\star \le \eps\) | Unknown | \(O(M^2/(\mu \eps))\) | `LB?` | / | [[27]](#ref-arxiv-1904-09015), Table 3 |
| 31 | `SUM C SM FO STAT` | \(\left|\sum_{i=1}^N F_i(\bar x_{i,T})-\sum_{i=1}^N F_i(x^\star)\right|\le\eps\) | Unknown | \(O(C_{\mathbf S}C_0/(\alpha_{\rm DAGP}\eps)+C_{\mathbf S}C_0 C_2/(\eta_{\rm alg}N\eps^2))\)<sup>[O2](#remark-O2)</sup> | `LB?` | / | [[28]](#ref-arxiv-2210-03232), Theorem 2 |
| 32 | `SUM C SM FO TV`<sup>[S17](#remark-S17)</sup> | \(F(\bar x)-F^\star \le \eps\) | Unknown | \(O(\sqrt{L/\eps})\)<sup>[N2](#remark-N2), [N1](#remark-N1)</sup> | `LB?` | / | [[29]](#ref-arxiv-2104-02596), Theorem 1; Corollary 3 |
| 33 | `SUM C SM SFO STAT`<sup>[S22](#remark-S22)</sup> | \(\E[F(x_i)-F^\star] \le \eps,\ \forall i\) | Unknown | \(\widetilde O(\sigma^2 R^2/(N\eps^2)+\sqrt{L R^2/(\rho_{\rm K}\eps)})\)<sup>[A24](#remark-A24), [G1](#remark-G1), [G14](#remark-G14), [A25](#remark-A25)</sup> | `LB?` | / | [[12]](#ref-arxiv-2606-04757), Theorem 6 |
| 34 | `SUM C NS FO STAT COMP PROX` | \(F(\bar y_T)-F^\star\le\eps\) | Unknown | \(O(\eps^{-1/2})\)<sup>[O1](#remark-O1), [N2](#remark-N2), [N1](#remark-N1)</sup> | `LB?` | / | [[30]](#ref-arxiv-2312-15845), Theorem 3; Corollary 4 |
| 35 | `SUM C NS SFO STAT` | \(\E[F(\hat x_i(T))-F^\star]\le\eps\) | Unknown | \(\widetilde O(M^2 R^2/(\rho \eps^2))\) | `LB?` | / | [[31]](#ref-arxiv-1005-2012), Theorem 4 |
| 36 | `SUM C NS SFO TV COMP` | \(F(\tilde x_i^T)-F^\star\le\eps\) | Unknown | \(\widetilde O(\eps^{-2})\)<sup>[G2](#remark-G2), [O4](#remark-O4), [A15](#remark-A15), [G16](#remark-G16)</sup> | `LB?` | / | [[32]](#ref-arxiv-2506-12901), Theorem 4 |
| 37 | `SUM C NS SFO TV COMP PROX` | \(\E[F(\tilde x^S)-F^\star]\le\eps\) | Unknown | \(\widetilde O(K_{\rm loc}+(\Delta/\eps)^{1/q_{\rm DPS}})\)<sup>[O1](#remark-O1), [N2](#remark-N2), [N1](#remark-N1)</sup> | `LB?` | / | [[33]](#ref-arxiv-2112-10389), Theorems 2 and 3; Algorithm 1 |
| 38 | `SUM C NS SUBG STAT`<sup>[S26](#remark-S26)</sup> | \(F(\hat x_i(T))-F^\star\le\eps\) | Unknown | \(\widetilde O(N^2 M^2 R^2/\eps^2)\) | `LB?` | / | [[31]](#ref-arxiv-1005-2012), Corollary 1 |
| 39 | `SUM C NS SUBG STAT`<sup>[S27](#remark-S27)</sup> | \(F(\hat x_i(T))-F^\star\le\eps\) | Unknown | \(\widetilde O(M^2 R^2/\eps^2)\) | `LB?` | / | [[31]](#ref-arxiv-1005-2012), Corollary 1 |
| 40 | `SUM C NS SUBG STAT`<sup>[S25](#remark-S25)</sup> | \(F(\hat x_i(T))-F^\star\le\eps\) | Unknown | \(\widetilde O(N M^2 R^2/\eps^2)\) | `LB?` | / | [[31]](#ref-arxiv-1005-2012), Corollary 1 |
| 41 | `SUM C NS SUBG STAT`<sup>[S5](#remark-S5)</sup> | \(\mathcal E_{\rm obj}(\hat y)\le\eps\) | Unknown | \(O(M^2\sqrt{N\log N}/\eps^2)\)<sup>[A23](#remark-A23)</sup> | `LB?` | / | [[34]](#ref-arxiv-1411-4186), Proposition 3.12 |
| 42 | `SUM C NS SUBG STAT` | \(|F(\tilde x_i(t))-F^\star|\le\eps\) | Unknown | \(\widetilde O(\eps^{-2})\) | `LB?` | / | [[35]](#ref-arxiv-1806-07081), Theorem 5; Corollary 2(b) |
| 43 | `SUM C NS SUBG TV`<sup>[S6](#remark-S6)</sup> | \(F(\hat x_j[T])-F^\star \le \eps\) | Unknown | \(O(1/\eps^2)\) | `LB?` | / | [[36]](#ref-arxiv-1606-08904), Theorem 2 |
| 44 | `SUM NC SM FO STAT`<sup>[S8](#remark-S8)</sup> | \(\min_{0\le k<T}\|\nabla F(\bar x_u^k)\|\le\eps\) | Unknown | \(O(1/(\eta^2\eps^2))\)<sup>[A6](#remark-A6), [A7](#remark-A7)</sup> | `LB?` | / | [[37]](#ref-arxiv-2601-03566), Theorem 1 |
| 45 | `SUM NC SM FO TV` | \(\frac1T\sum_{t=0}^{T-1}\|\nabla F(\bar x^{(t)})\|^2\le\eps\) | Unknown | \(O(\eps^{-1})\) | `LB?` | / | [[38]](#ref-arxiv-2512-24483), Theorem 2; Appendix A.9 |
| 46 | `SUM NC SM FO TV`<sup>[S9](#remark-S9)</sup> | \(\min_{1\le s\le t}\left(N\|G_a(y^{s-1},\bar z^{s-1})\|_{\E}^2+\|X^{s-1}-\mathbf{y}^{s-1}\|_{\E}^2\right)\le\eps\)<sup>[M2](#remark-M2)</sup> | Unknown | \(O(C_{\rm DDA}/\eps)\) | `LB?` | / | [[39]](#ref-arxiv-2211-06914), Theorem 2; Equation (23); Algorithm 1 |
| 47 | `SUM NC SM SFO STAT` | \(\frac1T\sum_{t=0}^{T-1}\E\|\bar g(X^{(t)})\|_* \le \eps\)<sup>[M2](#remark-M2)</sup> | Unknown | \((p-1)T=O((p-1)\eps^{-(3p+1)/p})\)<sup>[A1](#remark-A1), [A20](#remark-A20)</sup> | `LB?` | / | [[40]](#ref-arxiv-2510-01377), Theorem 6; Equation (23) |
| 48 | `SUM NC SM SFO TV` | \(\E\|\nabla F(\hat x)\|^2 \le \eps^2\) | Unknown | \(O(K_{\rm loc}+\sqrt{K_{\rm loc}}\bar L\Delta/\eps^2)\) | `LB?` | / | [[23]](#ref-arxiv-2402-02490), Theorem 4.3; Corollary 4.5 |
| 49 | `SUM NC NS SFO STAT COMP PROX` | \(\E\|\mathbf s(\hat x)\|^2 \le \eps^2\) | Unknown | \(O((L\Delta/\eps^2)\max\{\sqrt{K_{\rm loc}/N},1\}+\max\{K_{\rm loc},\sqrt{NK_{\rm loc}}\})\)<sup>[O1](#remark-O1), [A17](#remark-A17)</sup> | `LB?` | / | [[41]](#ref-arxiv-2110-01594), Theorem 3; Table 1 |
| 50 | `SUM PL SM FO STAT` | \(F(\bar x)-F^\star \le \eps\) | Unknown | \(O(\theta^{-1}\log(c/(N\eps)))\) | `LB?` | / | [[42]](#ref-arxiv-1912-12110), Theorem 2; Equation (15) |
| 51 | `SUM PL SM FO TV` | \(F(\bar x)-F^\star \le \eps\) | Unknown | \(O(\kappa\log(\Delta/\eps))\)<sup>[G6](#remark-G6)</sup> | `LB?` | / | [[43]](#ref-arxiv-2210-03810), Theorem 3.1 |
| 52 | `STO SC SM SFO STAT`<sup>[S1](#remark-S1), [S19](#remark-S19)</sup> | \(\E\|\bar x_{\pi_{\rm SAB}}^k-x^\star\|^2\le\eps\) | Unknown | \(O(\eps^{-1})\)<sup>[G4](#remark-G4), [A18](#remark-A18)</sup> | `LB?` | / | [[44]](#ref-arxiv-2109-07981), Theorem 1 and following rate paragraph |
| 53 | `STO SC SM SFO TV` | \(\sum_{t=0}^T\frac{w_t}{W_T}\E[F(\bar x^{(t)})-F^\star]+\mu\E\|\bar x^{(T+1)}-x^\star\|^2\le\eps\) | Unknown | \(\widetilde O(\sigma^2/(\mu N\eps)+\sqrt{L}(\bar\zeta+\sigma\sqrt{\delta_{\rm net}})/(\mu\delta_{\rm net}\sqrt{\eps})+L\log(1/\eps)/(\mu\delta_{\rm net}))\)<sup>[N5](#remark-N5)</sup> | `LB?` | / | [[45]](#ref-arxiv-2003-10422), Theorem 2 |
| 54 | `STO SC NS SFO STAT` | \(F(\hat x)-F^\star \le \eps\) | Unknown | \(O((M^2+\sigma^2)/(\mu \eps))\)<sup>[G2](#remark-G2)</sup> | `LB?` | / | [[27]](#ref-arxiv-1904-09015), Table 4 |
| 55 | `STO SC NS SFO TV` | \(\E[F(\bar x)-F^\star]\le\eps\) | Unknown | \(O((M+\sigma)^2/(\mu\eps))\) | `LB?` | / | [[46]](#ref-arxiv-2508-09029), Theorem 2 |
| 56 | `STO C SM SFO TV` | \((1/(T+1)) \sum_{t=0}^T \E[F(\bar x^{(t)})-F^\star] \le \eps\) | Unknown | \(O(R^2(\sigma^2/(N\eps^2)+\sqrt{L}(\bar\zeta+\sigma\sqrt{\delta_{\rm net}})/(\delta_{\rm net}\eps^{3/2})+L/(\delta_{\rm net}\eps)))\)<sup>[N5](#remark-N5)</sup> | `LB?` | / | [[45]](#ref-arxiv-2003-10422), Theorem 2 |
| 57 | `STO C NS SFO STAT` | \(F(\hat x)-F^\star \le \eps\) | Unknown | \(O((M^2+\sigma^2) R^2/\eps^2)\)<sup>[G2](#remark-G2), [A16](#remark-A16)</sup> | `LB?` | / | [[27]](#ref-arxiv-1904-09015), Table 4 |
| 58 | `STO C NS SFO TV` | \(\E[F(\bar x)-F^\star]\le\eps\) | Unknown | \(O((M+\sigma)^2R^2/\eps^2)\) | `LB?` | / | [[46]](#ref-arxiv-2508-09029), Theorem 3 |
| 59 | `STO NC SM SFO STAT` | \(\frac1T\sum_{t=0}^{T-1}\E\|\nabla F(\bar x^{(t)})\|^2\le3\eps^2+\alpha_{\rm DSP}\eps^3\) | Unknown | \(O(\ell_{\rm DSP}\sigma\eps^{-3}+\sigma^2\eps^{-2})\)<sup>[A21](#remark-A21)</sup> | `LB?` | / | [[47]](#ref-arxiv-1911-12665), Theorem 1; Corollary 1 |
| 60 | `STO NC SM SFO STAT` | \(\frac1T\sum_{t=1}^{T}\E\|\nabla F(\bar x_{\pi_A}^t)\|^2 \le \eps\) | Unknown | \(O\!\left(\frac{\sigma^2L\Delta}{N\eps^2}+\frac{(1+\log\kappa_A+\log N)L\Delta}{(1-\beta_A)\eps}\right)\)<sup>[G12](#remark-G12)</sup> | `LB?` | / | [[48]](#ref-arxiv-2506-04600), Theorem 3 |
| 61 | `STO NC SM SFO TV`<sup>[S21](#remark-S21)</sup> | \((1/T) \sum_{t=0}^{T-1} \E[\|\nabla F(\bar x^{(t)})\|^2] \le \eps\) | Unknown | \(O((1+\sigma^2)^2/(N\eps^2)+N\zeta_{\rm stat}^2/\eps)\)<sup>[G3](#remark-G3), [A22](#remark-A22)</sup> | `LB?` | / | [[49]](#ref-arxiv-2412-07252), Theorem 2; Corollary 1 |
| 62 | `STO NC NS SFO STAT` | \(\E\|\nabla F(\hat x)\|_{\delta_{\rm G}} \le \eps\) | Unknown | \(O(\rho^{-2}\delta_{\rm G}^{-1}\eps^{-3})\) | `LB?` | / | [[50]](#ref-arxiv-2406-01484), Theorem 2; Theorem 1 |
| 63 | `SUM SC NS SFO STAT` | \(-\) | Unknown | Unknown | `Unknown` | / | / |
| 64 | `SUM SC NS SFO TV` | \(-\) | Unknown | Unknown | `Unknown` | / | / |
| 65 | `SUM C SM SFO TV` | \(-\) | Unknown | Unknown | `Unknown` | / | / |
| 66 | `SUM C NS FO TV` | \(-\) | Unknown | Unknown | `Unknown` | / | / |
| 67 | `SUM NC NS FO STAT` | \(-\) | Unknown | Unknown | `Unknown` | / | / |
| 68 | `SUM NC NS FO TV` | \(-\) | Unknown | Unknown | `Unknown` | / | / |
| 69 | `SUM NC NS SFO TV` | \(-\) | Unknown | Unknown | `Unknown` | / | / |
| 70 | `SUM NC NS SUBG STAT` | \(-\) | Unknown | Unknown | `Unknown` | / | / |
| 71 | `SUM NC NS SUBG TV` | \(-\) | Unknown | Unknown | `Unknown` | / | / |
| 72 | `SUM PL SM SFO TV` | \(-\) | Unknown | Unknown | `Unknown` | / | / |
| 73 | `STO NC NS SFO TV` | \(-\) | Unknown | Unknown | `Unknown` | / | / |
| 74 | `STO PL SM SFO TV` | \(-\) | Unknown | Unknown | `Unknown` | / | / |

## Remark Notes

Superscript markers next to main-table entries identify conditions that qualify a result's scope, assumptions, guarantee, target, or oracle-query accounting. `S`: Scope and topology; `O`: Oracle and side access; `A`: Additional assumptions; `G`: Guarantee regime; `M`: Metric and target qualification; `N`: Normalization and counting.

### Scope and topology

These notes identify restrictions on the communication graph, mixing model, topology family, or decentralized method class covered by the cited result.

<a id="remark-S1"></a>
**S1.** The cited result is stated for directed communication graphs rather than the unrestricted static or time-varying graph class.

<a id="remark-S2"></a>
**S2.** The cited lower bound uses the paper's sun-shaped time-varying graph construction.

<a id="remark-S3"></a>
**S3.** The cited result assumes the mixing parameter satisfies \(\beta\leq\cos(\pi/N)\).

<a id="remark-S4"></a>
**S4.** The cited result assumes the mixing parameter satisfies \(\beta\leq1-1/N\).

<a id="remark-S5"></a>
**S5.** The cited result is restricted to two-dimensional grid or geometric network topologies.

<a id="remark-S6"></a>
**S6.** The packet-drop model starts from a fixed strongly connected directed graph and requires every original communication edge to succeed at least once in every B consecutive rounds.

<a id="remark-S8"></a>
**S8.** The cited result uses separate directed row-stochastic and column-stochastic mixing matrices.

<a id="remark-S9"></a>
**S9.** The cited result is formulated for a random-network model rather than an arbitrary deterministic time-varying network.

<a id="remark-S11"></a>
**S11.** The cited lower bound is proved for a linear-span method class on directed graphs.

<a id="remark-S12"></a>
**S12.** The cited lower bound is restricted to the paper's zero-initialized linear-span or local-memory decentralized first-order method class.

<a id="remark-S13"></a>
**S13.** Every time-varying mixing operator must preserve consensus and satisfy the paper's uniform contraction bound on the disagreement subspace.

<a id="remark-S14"></a>
**S14.** The cited result uses one fixed strongly connected directed graph with a primitive column-stochastic mixing matrix.

<a id="remark-S15"></a>
**S15.** The time-varying directed graphs are jointly strongly connected over every C-step window; the row- and column-stochastic weights have self-loops and uniform positive lower bounds.

<a id="remark-S16"></a>
**S16.** The cited result assumes a fixed connected undirected network and a symmetric positive-semidefinite gossip operator with the stated consensus kernel.

<a id="remark-S17"></a>
**S17.** The cited result assumes doubly stochastic mixing and a finite window parameter for which the paper's contraction factor \(\sigma_\gamma<1\).

<a id="remark-S18"></a>
**S18.** The cited multi-gossip result uses a symmetric doubly stochastic mixing matrix on a connected static graph.

<a id="remark-S19"></a>
**S19.** The cited S-AB result uses separate row- and column-stochastic directed matrices whose associated graphs have spanning trees with intersecting root sets.

<a id="remark-S20"></a>
**S20.** The cited S-ADDOPT result assumes a fixed strongly connected directed graph and requires each node to know its out-degree.

<a id="remark-S21"></a>
**S21.** The cited Push-SUM result assumes directed communication with strong connectivity over every fixed-length window.

<a id="remark-S22"></a>
**S22.** The cited result assumes a fixed symmetric doubly-stochastic gossip matrix and uses a reference-specific gap based on the second-largest eigenvalue, rather than the global one-step contraction gap.

<a id="remark-S23"></a>
**S23.** The cited lower bound uses an \(N\)-node path with \(N\geq6\), \(\rho=\Theta(N^{-2})\), origin initialization, averaged output, and \(d=\Theta(S\sqrt\rho)\).

<a id="remark-S24"></a>
**S24.** The graph sequence is time-varying and directed; every union over B0 consecutive graphs is strongly connected, and each mixing matrix is column stochastic with the paper's out-degree weights.

<a id="remark-S25"></a>
**S25.** The cited upper bound is specialized to a two-dimensional grid topology.

<a id="remark-S26"></a>
**S26.** The cited upper bound is specialized to a cycle or path topology.

<a id="remark-S27"></a>
**S27.** The cited upper bound is specialized to an expander topology.

### Oracle and side access

These notes record oracle primitives or exact local operations required in addition to the local first-order calls counted in the displayed complexity.

<a id="remark-O1"></a>
**O1.** The cited result assumes exact access to a proximal operator in addition to the counted first-order oracle calls.

<a id="remark-O2"></a>
**O2.** The cited result requires exact local orthogonal projections onto the node constraint sets in addition to the counted gradients.

<a id="remark-O3"></a>
**O3.** The oracle model allows exact gradients of the local Fenchel conjugates in addition to ordinary local gradients; MSDA uses this conjugate-function gradient primitive.

<a id="remark-O4"></a>
**O4.** The cited result requires a mirror-map operation in addition to the counted stochastic first-order oracle calls.

<a id="remark-O5"></a>
**O5.** The cited lower bound restricts algorithms to the paper's partial-averaging communication model.

<a id="remark-O6"></a>
**O6.** The cited result relies on a finite consensus routine whose accuracy depends on the target accuracy.

### Additional assumptions

These notes list hypotheses that are stronger or more specific than the canonical row tags alone, including regularity, heterogeneity, initialization, and algorithmic restrictions.

<a id="remark-A1"></a>
**A1.** The cited result assumes order-\(p\) smoothness, which is stronger than ordinary first-order smoothness when \(p>1\).

<a id="remark-A2"></a>
**A2.** The cited upper bound assumes the paper's weak close-distribution condition, which bounds cross-node gradient dissimilarity only at the common initial point \(x=0\).

<a id="remark-A3"></a>
**A3.** The cited upper bound assumes a uniform bound on gradient dissimilarity across nodes.

<a id="remark-A6"></a>
**A6.** The cited result uses the paper's generalized-smoothness condition.

<a id="remark-A7"></a>
**A7.** The cited result assumes relative dissimilarity among local objectives.

<a id="remark-A8"></a>
**A8.** The cited lower bound is restricted to zero-respecting algorithms.

<a id="remark-A9"></a>
**A9.** The cited result requires \(\nu=O(R/(\sqrt N\,\bar\zeta))\) to attain the displayed rate.

<a id="remark-A10"></a>
**A10.** The cited nonsmooth result uses local regularity: every local objective is convex and has its own finite Lipschitz constant.

<a id="remark-A11"></a>
**A11.** The cited nonsmooth lower bound is stated in the sufficiently high-dimensional regime required by its hard-instance construction.

<a id="remark-A12"></a>
**A12.** The cited lower bound holds only in its stated accuracy and smoothness-parameter regime, including the explicit separation between the mean and aggregate smoothness constants.

<a id="remark-A13"></a>
**A13.** The cited primal-dual linear-rate result assumes a fixed connected undirected graph, smooth strongly convex local functions, exact local gradients, and the prescribed initialization and stepsize conditions.

<a id="remark-A14"></a>
**A14.** The cited FROST result assumes a strongly connected static digraph, smooth strongly convex local objectives, and uncoordinated stepsizes in its admissible range.

<a id="remark-A15"></a>
**A15.** The cited Sub-Weibull result additionally assumes bounded local subgradients, Lipschitz regularizers, Sub-Weibull noise, strong graph connectivity, and convexity of the Bregman divergence in its second argument.

<a id="remark-A16"></a>
**A16.** The displayed stochastic primal bound assumes a finite Bregman diameter on the feasible set; it is not an unrestricted whole-space guarantee.

<a id="remark-A17"></a>
**A17.** The cited ProxGT-SR-E result assumes mean-squared smooth component gradients, unbiased sampling with bounded variance, consensual initialization, the stated spectral mixing condition, and exact prox.

<a id="remark-A18"></a>
**A18.** The cited S-AB asymptotic result assumes second-order growth at the optimum and differentiable stochastic gradients with the stated higher-moment and random-Lipschitz bounds.

<a id="remark-A19"></a>
**A19.** The cited S-ADDOPT result assumes conditionally unbiased stochastic gradients with uniformly bounded conditional variance.

<a id="remark-A20"></a>
**A20.** The cited DeMuon result assumes consensual initialization, bounded matrix noise, a primitive doubly stochastic mixer, coupled extrapolation and momentum parameters, horizon-dependent stepsizes, and the theorem's minimum iteration threshold.

<a id="remark-A21"></a>
**A21.** The cited D-SPIDER-SFO result assumes smooth local objectives, unbiased bounded-variance stochastic gradients, the stated spectral mixing condition, consensual initialization, and the prescribed batch and stepsize rules.

<a id="remark-A22"></a>
**A22.** The cited Push-SUM result assumes bounded stochastic-gradient variance and a uniform global bound on cross-node gradient dissimilarity.

<a id="remark-A23"></a>
**A23.** The optimization consequence treats its initial-distance factor as bounded and requires every node to know a common size estimate \(U\) satisfying \(U\geq N\) and \(U=O(N)\).

<a id="remark-A24"></a>
**A24.** The objective is a deterministic node sum; stochasticity enters only through the local oracle.

<a id="remark-A25"></a>
**A25.** Heterogeneity is bounded only at the optimum, not uniformly for all x.

### Guarantee regime

These notes explain the probabilistic, initialization, stepsize, finite-time, or asymptotic regime in which the displayed guarantee holds.

<a id="remark-G1"></a>
**G1.** The cited result provides the displayed guarantee only from a prescribed warm start.

<a id="remark-G2"></a>
**G2.** The displayed complexity is a high-probability guarantee rather than an expectation guarantee.

<a id="remark-G3"></a>
**G3.** The displayed rate is the sufficiently-large-T simplification in Corollary 1; Theorem 2 contains additional finite-time initial-error, network, variance, and heterogeneity terms.

<a id="remark-G4"></a>
**G4.** The cited result uses a diminishing stepsize schedule.

<a id="remark-G6"></a>
**G6.** The displayed rate assumes an exact oracle (zero oracle bias); the consensus tolerance is chosen with the target accuracy so the additive error floor is at most the target, affecting communication rounds but not the displayed per-node gradient-query order.

<a id="remark-G7"></a>
**G7.** The cited directed lower bound requires \(\beta_\pi\) to be bounded away from zero, \(\beta_\pi\leq1-1/N\), and \(\log\kappa_\pi=\Omega(N(1-\beta_\pi))\); it is not uniform over all parameter tuples.

<a id="remark-G8"></a>
**G8.** The displayed AdaMDOF sample order uses a local batch size of order \(\sqrt{K_{\rm loc}}\), together with the momentum, stepsize, and adaptive-matrix parameter ranges prescribed by the cited result.

<a id="remark-G9"></a>
**G9.** The displayed logarithmic iteration complexity suppresses a contraction factor whose constants depend on graph connectivity, mixing weights, objective regularity, and the admissible stepsize.

<a id="remark-G10"></a>
**G10.** The cited GT-SVRG result requires the prescribed stepsize, inner-loop length, and initialization conditions.

<a id="remark-G11"></a>
**G11.** The displayed \(\epsilon\)-only logarithmic order treats the cited result's contraction factor as fixed; otherwise the iteration count is proportional to \(\log(1/\epsilon)/\log(1/\gamma)\).

<a id="remark-G12"></a>
**G12.** The cited MG-PullDiag-GT result requires the specified stepsize, minibatch, inner-loop, and directed-mixing parameter choices.

<a id="remark-G13"></a>
**G13.** The first restart epoch starts in consensus; later epochs use warm-started outputs.

<a id="remark-G14"></a>
**G14.** The cited warm-start result requires its two explicit RMS disagreement inequalities.

<a id="remark-G15"></a>
**G15.** Each node uses a positive time-invariant but node-dependent stepsize. The stepsize maximum and ratio must satisfy Theorem 4.1 or Corollary 4.2; the displayed logarithmic oracle order treats the induced contraction factor \(\lambda\in(0,1)\) as fixed, and otherwise carries a factor \(1/\log(1/\lambda)\).

<a id="remark-G16"></a>
**G16.** The displayed Sub-Weibull complexity suppresses confidence- and tail-dependent polylogarithmic factors, including powers of \(\log(T/\delta_{\rm ht})\) governed by the tail index, where \(\delta_{\rm ht}\) is the failure probability.

### Metric and target qualification

These notes clarify how the cited result's controlled metric or merit target differs from, or is related to, the measure displayed in the table.

<a id="remark-M1"></a>
**M1.** The cited result controls a Bregman merit function rather than the ordinary objective gap or Euclidean distance.

<a id="remark-M2"></a>
**M2.** Only the stationarity component of the cited result is retained in the displayed metric; its other residual terms are omitted.

<a id="remark-M3"></a>
**M3.** The displayed metric follows from the equivalence between the strongly convex smooth metric in the source and the table measure.

<a id="remark-M4"></a>
**M4.** The cited lower bound uses a node-local output selected from local memory, whereas the cited upper bound uses the global average output; only the oracle-order expressions are compared.

<a id="remark-M5"></a>
**M5.** The cited lower bound permits an arbitrary algorithm output, whereas the cited upper bound controls the iteration-average metric over network-average iterates; only the resulting oracle orders are compared.

### Normalization and counting

These notes explain how iteration, batch, and sample counts in cited results are converted into per-node oracle queries and which communication work is excluded.

<a id="remark-N1"></a>
**N1.** The displayed complexity counts local gradient evaluations and does not count the additional consensus rounds.

<a id="remark-N2"></a>
**N2.** Each outer iteration performs multiple gossip or consensus rounds, which are not counted as oracle queries in the displayed rate.

<a id="remark-N3"></a>
**N3.** The displayed count \(N_{\rm SFO}=T_{\rm out}R\) includes the \(R\) samples per outer iteration; each outer iteration also performs two \(R\)-round gossip phases, counted separately as communication.

<a id="remark-N4"></a>
**N4.** The displayed stochastic-oracle complexity is normalized to local batch size \(B=1\).

<a id="remark-N5"></a>
**N5.** The displayed effective per-iteration network rate normalizes the cited result's block-contraction parameter by its mixing-window length.

<a id="remark-N7"></a>
**N7.** The displayed per-node epsilon form is derived from the communication-round bound in its nonconstant-error branch.

<a id="remark-N8"></a>
**N8.** The displayed network-dependent lower-bound term is an oracle projection of a coupled round model in which each node performs one local query and one gossip step per round; it is not an unconditional communication-free oracle lower bound.

<a id="remark-N9"></a>
**N9.** The displayed lower bound divides an aggregate LIFO lower bound by \(N\); it applies to average and worst-node workload, not every node individually. The full computation-round lower bound additionally contains \(L\Delta/\epsilon^2\) in the nonconvex row and \(\kappa\log(1/\epsilon)\) in the PL row. These serial-depth terms are excluded from the oracle count because partial participation permits different nodes to carry different rounds.

<a id="remark-N10"></a>
**N10.** The displayed upper bound divides expected aggregate LIFO calls by the node count under uniform node-component sampling; it is an expected per-node workload bound rather than an expected-maximum workload bound.

## Summary

Across 74 rows, the current Decentralized Optimization table presents 47 of 96 settings and omits the remaining 49 unknown settings. Evidence covers 35 of the 47 presented settings (35 of 96 in the full grid), while 12 presented settings are explicitly `Unknown`. The table retains 14 lower-bound and 61 upper-bound claim sides (75 total), citing 50 distinct arXiv papers; 11 papers contribute a retained lower bound and 50 contribute a retained upper bound, with overlap between the two paper sets. Row statuses are `EXACT` 2; `COND` 7; `LOG` 1; `GAP` 3; `UB?` 1; `LB?` 48; `Unknown` 12; status totals count rows and paper totals are deduplicated by arXiv ID.

## References

<a id="ref-arxiv-2106-04469"></a>
[1] [Lower Bounds and Optimal Algorithms for Smooth and Strongly Convex Decentralized Optimization Over Time-Varying Networks](https://arxiv.org/abs/2106.04469) [[arXiv]](https://arxiv.org/abs/2106.04469)
Kovalev, Gasanov, Gasnikov, and Richtarik. NeurIPS, 2021.

<a id="ref-arxiv-1806-00291"></a>
[2] [Optimal Algorithms for Non-Smooth Distributed Optimization in Networks](https://arxiv.org/abs/1806.00291) [[arXiv]](https://arxiv.org/abs/1806.00291)
Scaman, Bach, Bubeck, Lee, and Massoulie. arXiv, 2018.

<a id="ref-arxiv-1702-08704"></a>
[3] [Optimal Algorithms for Smooth and Strongly Convex Distributed Optimization in Networks](https://proceedings.mlr.press/v70/scaman17a.html) [[arXiv]](https://arxiv.org/abs/1702.08704)
Scaman, Bach, Bubeck, Lee, and Massoulie. ICML, 2017.

<a id="ref-arxiv-2405-18031"></a>
[4] [Lower Bounds and Optimal Algorithms for Non-Smooth Convex Decentralized Optimization over Time-Varying Networks](https://arxiv.org/abs/2405.18031) [[arXiv]](https://arxiv.org/abs/2405.18031)
Dmitry Kovalev, Ekaterina Borodich, Alexander Gasnikov, and Dmitrii Feoktistov. arXiv, 2024.

<a id="ref-arxiv-1910-10666"></a>
[5] [Accelerated Primal-Dual Algorithms for Distributed Smooth Convex Optimization over Networks](https://arxiv.org/abs/1910.10666) [[arXiv]](https://arxiv.org/abs/1910.10666)
Xu, Tian, Sun, and Scutari. AISTATS, 2020.

<a id="ref-arxiv-2210-07863"></a>
[6] [Revisiting Optimal Convergence Rate for Smooth and Non-convex Stochastic Decentralized Optimization](https://arxiv.org/abs/2210.07863) [[arXiv]](https://arxiv.org/abs/2210.07863)
Yuan et al. NeurIPS, 2022.

<a id="ref-arxiv-2312-04928"></a>
[7] [Understanding the Influence of Digraphs on Decentralized Optimization: Effective Metrics, Lower Bound, and Optimal Algorithm](https://arxiv.org/abs/2312.04928) [[arXiv]](https://arxiv.org/abs/2312.04928)
Liyuan Liang, Xinmeng Huang, Ran Xin, and Kun Yuan. arXiv, 2023.

<a id="ref-arxiv-2211-00533"></a>
[8] [Lower and Upper Bounds for Nonconvex Decentralized Optimization over Time-varying Networks](https://arxiv.org/abs/2211.00533) [[arXiv]](https://arxiv.org/abs/2211.00533)
Huang et al. arXiv, 2022.

<a id="ref-arxiv-2210-13931"></a>
[9] [On the Complexity of Decentralized Smooth Nonconvex Finite-Sum Optimization](https://arxiv.org/abs/2210.13931) [[arXiv]](https://arxiv.org/abs/2210.13931)
Luo Luo, Yunyan Bai, Lesi Chen, Yuxing Liu, and Haishan Ye. arXiv, 2022.

<a id="ref-arxiv-2408-09775"></a>
[10] [Faster Adaptive Decentralized Learning Algorithms](https://arxiv.org/abs/2408.09775) [[arXiv]](https://arxiv.org/abs/2408.09775)
Feihu Huang and Jianyu Zhao. arXiv, 2024.

<a id="ref-arxiv-2006-08085"></a>
[11] [Optimal Complexity in Decentralized Training](https://arxiv.org/abs/2006.08085) [[arXiv]](https://arxiv.org/abs/2006.08085)
Lu, Tsaknakis, Hong, and Chen. ICML, 2021.

<a id="ref-arxiv-2606-04757"></a>
[12] [Near-Optimal Decentralized Stochastic Convex Optimization over Networks](https://arxiv.org/abs/2606.04757) [[arXiv]](https://arxiv.org/abs/2606.04757)
Kluger, Attia, and Koren. arXiv, 2026.

<a id="ref-arxiv-2004-02635"></a>
[13] [Dualize, Split, Randomize: Toward Fast Nonsmooth Optimization Algorithms](https://arxiv.org/abs/2004.02635) [[arXiv]](https://arxiv.org/abs/2004.02635)
Adil Salim, Laurent Condat, Konstantin Mishchenko, and Peter Richtárik. arXiv, 2020.

<a id="ref-arxiv-2308-08164"></a>
[14] [Privacy-Preserving Push-Pull Method for Decentralized Optimization via State Decomposition](https://arxiv.org/abs/2308.08164) [[arXiv]](https://arxiv.org/abs/2308.08164)
Huqiang Cheng, Xiaofeng Liao, Huaqing Li, and You Zhao. arXiv, 2023.

<a id="ref-arxiv-1803-09169"></a>
[15] [FROST -- Fast row-stochastic optimization with uncoordinated step-sizes](https://arxiv.org/abs/1803.09169) [[arXiv]](https://arxiv.org/abs/1803.09169)
Ran Xin, Chenguang Xi, and Usman A. Khan. arXiv, 2018.

<a id="ref-arxiv-1810-07393"></a>
[16] [Optimization over time-varying directed graphs with row and column-stochastic matrices](https://arxiv.org/abs/1810.07393) [[arXiv]](https://arxiv.org/abs/1810.07393)
Fakhteh Saadatniaki, Ran Xin, and Usman A. Khan. arXiv, 2018.

<a id="ref-arxiv-1611-00990"></a>
[17] [Geometrical Convergence Rate for Distributed Optimization with Time-Varying Directed Graphs and Uncoordinated Step-Sizes](https://arxiv.org/abs/1611.00990) [[arXiv]](https://arxiv.org/abs/1611.00990)
Qingguo Lü and Huaqing Li. arXiv, 2016.

<a id="ref-arxiv-1911-08527"></a>
[18] [Projected Gradient Method for Decentralized Optimization over Time-Varying Networks](https://arxiv.org/abs/1911.08527) [[arXiv]](https://arxiv.org/abs/1911.08527)
Alexander Rogozin and Alexander Gasnikov. arXiv, 2019.

<a id="ref-arxiv-2309-02626"></a>
[19] [Adaptive Consensus: A network pruning approach for decentralized optimization](https://arxiv.org/abs/2309.02626) [[arXiv]](https://arxiv.org/abs/2309.02626)
Suhail M. Shah, Albert S. Berahas, and Raghu Bollapragada. arXiv, 2023.

<a id="ref-arxiv-2005-07785"></a>
[20] [S-ADDOPT: Decentralized stochastic first-order optimization over directed graphs](https://arxiv.org/abs/2005.07785) [[arXiv]](https://arxiv.org/abs/2005.07785)
Muhammad I. Qureshi, Ran Xin, Soummya Kar, and Usman A. Khan. arXiv, 2020.

<a id="ref-arxiv-2009-04373"></a>
[21] [Variance Reduced EXTRA and DIGing and Their Optimal Acceleration for Strongly Convex Decentralized Optimization](https://arxiv.org/abs/2009.04373) [[arXiv]](https://arxiv.org/abs/2009.04373)
Huan Li, Zhouchen Lin, and Yongchun Fang. arXiv, 2020.

<a id="ref-arxiv-1910-04057"></a>
[22] [Variance-Reduced Decentralized Stochastic Optimization with Gradient Tracking -- Part II: GT-SVRG](https://arxiv.org/abs/1910.04057) [[arXiv]](https://arxiv.org/abs/1910.04057)
Ran Xin, Usman A. Khan, and Soummya Kar. arXiv, 2019.

<a id="ref-arxiv-2402-02490"></a>
[23] [Decentralized Finite-Sum Optimization over Time-Varying Networks](https://arxiv.org/abs/2402.02490) [[arXiv]](https://arxiv.org/abs/2402.02490)
Dmitry Metelev, Savelii Chezhegov, Alexander Rogozin, Aleksandr Beznosikov, Alexander Sholokhov, Alexander Gasnikov, and Dmitry Kovalev. arXiv, 2024.

<a id="ref-arxiv-2312-11861"></a>
[24] [A Proximal Gradient Method With Probabilistic Multi-Gossip Communications for Decentralized Composite Optimization](https://arxiv.org/abs/2312.11861) [[arXiv]](https://arxiv.org/abs/2312.11861)
Luyao Guo, Luqing Wang, Xinli Shi, and Jinde Cao. arXiv, 2023.

<a id="ref-arxiv-1905-07996"></a>
[25] [A Linearly Convergent Proximal Gradient Algorithm for Decentralized Optimization](https://arxiv.org/abs/1905.07996) [[arXiv]](https://arxiv.org/abs/1905.07996)
Sulaiman A. Alghunaim, Kun Yuan, and Ali H. Sayed. arXiv, 2019.

<a id="ref-arxiv-2106-14075"></a>
[26] [Decentralized Composite Optimization in Stochastic Networks: A Dual Averaging Approach with Linear Convergence](https://arxiv.org/abs/2106.14075) [[arXiv]](https://arxiv.org/abs/2106.14075)
Changxin Liu, Zirui Zhou, Jian Pei, Yong Zhang, and Yang Shi. arXiv, 2021.

<a id="ref-arxiv-1904-09015"></a>
[27] [Decentralized and Parallel Primal and Dual Accelerated Methods for Stochastic Convex Programming Problems](https://arxiv.org/abs/1904.09015) [[arXiv]](https://arxiv.org/abs/1904.09015)
Darina Dvinskikh and Alexander Gasnikov. arXiv, 2019.

<a id="ref-arxiv-2210-03232"></a>
[28] [Double Averaging and Gradient Projection: Convergence Guarantees for Decentralized Constrained Optimization](https://arxiv.org/abs/2210.03232) [[arXiv]](https://arxiv.org/abs/2210.03232)
Firooz Shahriari-Mehr and Ashkan Panahi. arXiv, 2022.

<a id="ref-arxiv-2104-02596"></a>
[29] [Accelerated Gradient Tracking over Time-varying Graphs for Decentralized Optimization](https://arxiv.org/abs/2104.02596) [[arXiv]](https://arxiv.org/abs/2104.02596)
Li and Lin. arXiv, 2021.

<a id="ref-arxiv-2312-15845"></a>
[30] [Optimal Decentralized Composite Optimization for Convex Functions](https://arxiv.org/abs/2312.15845) [[arXiv]](https://arxiv.org/abs/2312.15845)
Haishan Ye and Xiangyu Chang. arXiv, 2023.

<a id="ref-arxiv-1005-2012"></a>
[31] [Dual Averaging for Distributed Optimization](https://arxiv.org/abs/1005.2012) [[arXiv]](https://arxiv.org/abs/1005.2012)
Duchi, Agarwal, and Wainwright. IEEE Transactions on Automatic Control, 2012.

<a id="ref-arxiv-2506-12901"></a>
[32] [High-Probability Convergence Theory for Distributed Composite Optimization with Sub-Weibull Noises](https://arxiv.org/abs/2506.12901) [[arXiv]](https://arxiv.org/abs/2506.12901)
Zhan Yu, Zhongjie Shi, and Deming Yuan. arXiv, 2025.

<a id="ref-arxiv-2112-10389"></a>
[33] [Decentralized Stochastic Proximal Gradient Descent with Variance Reduction over Time-varying Networks](https://arxiv.org/abs/2112.10389) [[arXiv]](https://arxiv.org/abs/2112.10389)
Xuanjie Li, Yuedong Xu, Jessie Hui Wang, Xin Wang, and John C. S. Lui. arXiv, 2021.

<a id="ref-arxiv-1411-4186"></a>
[34] [Linear Time Average Consensus on Fixed Graphs and Implications for Decentralized Optimization and Multi-Agent Control](https://arxiv.org/abs/1411.4186) [[arXiv]](https://arxiv.org/abs/1411.4186)
Alex Olshevsky. arXiv, 2014.

<a id="ref-arxiv-1806-07081"></a>
[35] [Distributed Optimization over Directed Graphs with Row Stochasticity and Constraint Regularity](https://arxiv.org/abs/1806.07081) [[arXiv]](https://arxiv.org/abs/1806.07081)
Van Sy Mai and Eyad H. Abed. arXiv, 2018.

<a id="ref-arxiv-1606-08904"></a>
[36] [On the Convergence Rate of Average Consensus and Distributed Optimization over Unreliable Networks](https://arxiv.org/abs/1606.08904) [[arXiv]](https://arxiv.org/abs/1606.08904)
Lili Su. arXiv, 2016.

<a id="ref-arxiv-2601-03566"></a>
[37] [Provably Convergent Decentralized Optimization over Directed Graphs under Generalized Smoothness](https://arxiv.org/abs/2601.03566) [[arXiv]](https://arxiv.org/abs/2601.03566)
Yanan Bo and Yongqiang Wang. arXiv, 2026.

<a id="ref-arxiv-2512-24483"></a>
[38] [Decentralized Optimization over Time-Varying Row-Stochastic Digraphs](https://arxiv.org/abs/2512.24483) [[arXiv]](https://arxiv.org/abs/2512.24483)
Liyuan Liang, Yilong Song, and Kun Yuan. arXiv, 2025.

<a id="ref-arxiv-2211-06914"></a>
[39] [Rate analysis of dual averaging for nonconvex distributed optimization](https://arxiv.org/abs/2211.06914) [[arXiv]](https://arxiv.org/abs/2211.06914)
Changxin Liu, Xuyang Wu, Xinlei Yi, Yang Shi, and Karl H. Johansson. arXiv, 2022.

<a id="ref-arxiv-2510-01377"></a>
[40] [DeMuon: A Decentralized Muon for Matrix Optimization over Graphs](https://arxiv.org/abs/2510.01377) [[arXiv]](https://arxiv.org/abs/2510.01377)
Chuan He, Shuyi Ren, Jingwei Mao, and Erik G. Larsson. arXiv, 2025.

<a id="ref-arxiv-2110-01594"></a>
[41] [A Stochastic Proximal Gradient Framework for Decentralized Non-Convex Composite Optimization: Topology-Independent Sample Complexity and Communication Efficiency](https://arxiv.org/abs/2110.01594) [[arXiv]](https://arxiv.org/abs/2110.01594)
Ran Xin, Subhro Das, Usman A. Khan, and Soummya Kar. arXiv, 2021.

<a id="ref-arxiv-1912-12110"></a>
[42] [Linear Convergence of First- and Zeroth-Order Primal-Dual Algorithms for Distributed Nonconvex Optimization](https://arxiv.org/abs/1912.12110) [[arXiv]](https://arxiv.org/abs/1912.12110)
Xinlei Yi, Shengjun Zhang, Tao Yang, Tianyou Chai, and Karl H. Johansson. arXiv, 2020.

<a id="ref-arxiv-2210-03810"></a>
[43] [Gradient-Type Methods For Decentralized Optimization Problems With Polyak-Lojasiewicz Condition Over Time-Varying Networks](https://arxiv.org/abs/2210.03810) [[arXiv]](https://arxiv.org/abs/2210.03810)
Ilya Kuruzov, Mohammad Alkousa, Fedor Stonyakin, and Alexander Gasnikov. arXiv, 2022.

<a id="ref-arxiv-2109-07981"></a>
[44] [Asymptotic Properties of S-AB Method with Diminishing Stepsize](https://arxiv.org/abs/2109.07981) [[arXiv]](https://arxiv.org/abs/2109.07981)
Shengchao Zhao and Yongchao Liu. arXiv, 2021.

<a id="ref-arxiv-2003-10422"></a>
[45] [A Unified Theory of Decentralized SGD with Changing Topology and Local Updates](https://arxiv.org/abs/2003.10422) [[arXiv]](https://arxiv.org/abs/2003.10422)
Anastasia Koloskova, Nicolas Loizou, Sadra Boreiri, Martin Jaggi, and Sebastian U. Stich. arXiv, 2020.

<a id="ref-arxiv-2508-09029"></a>
[46] [Stochastic Decentralized Optimization of Non-Smooth Convex and Convex-Concave Problems over Time-Varying Networks](https://arxiv.org/abs/2508.09029) [[arXiv]](https://arxiv.org/abs/2508.09029)
Maxim Divilkovskiy and Alexander Gasnikov. arXiv, 2025.

<a id="ref-arxiv-1911-12665"></a>
[47] [D-SPIDER-SFO: A Decentralized Optimization Algorithm with Faster Convergence Rate for Nonconvex Problems](https://arxiv.org/abs/1911.12665) [[arXiv]](https://arxiv.org/abs/1911.12665)
Taoxing Pan, Jun Liu, and Jie Wang. arXiv, 2019.

<a id="ref-arxiv-2506-04600"></a>
[48] [Achieving Linear Speedup and Near-Optimal Complexity for Decentralized Optimization over Row-stochastic Networks](https://arxiv.org/abs/2506.04600) [[arXiv]](https://arxiv.org/abs/2506.04600)
Liyuan Liang, Xinyi Chen, Gan Luo, and Kun Yuan. arXiv, 2025.

<a id="ref-arxiv-2412-07252"></a>
[49] [Adaptive Weighting Push-SUM for Decentralized Optimization with Statistical Diversity](https://arxiv.org/abs/2412.07252) [[arXiv]](https://arxiv.org/abs/2412.07252)
Yiming Zhou, Yifei Cheng, Linli Xu, and Enhong Chen. arXiv, 2024.

<a id="ref-arxiv-2406-01484"></a>
[50] [Online Optimization Perspective on First-Order and Zero-Order Decentralized Nonsmooth Nonconvex Stochastic Optimization](https://arxiv.org/abs/2406.01484) [[arXiv]](https://arxiv.org/abs/2406.01484)
Emre Sahinoglu and Shahin Shahrampour. arXiv, 2024.
