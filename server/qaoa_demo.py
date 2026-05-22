"""Build n-qubit ring MaxCut QAOA circuits for scalable lab demos."""

from __future__ import annotations


def ring_maxcut_hamiltonian(n_qubits: int):
    from qiskit.quantum_info import SparsePauliOp

    if n_qubits < 2:
        raise ValueError("Need at least 2 qubits for a ring")
    terms: list[tuple[str, float]] = []
    for i in range(n_qubits):
        j = (i + 1) % n_qubits
        label = ["I"] * n_qubits
        label[i] = "Z"
        label[j] = "Z"
        terms.append(("".join(label), 0.5))
    return SparsePauliOp.from_list(terms)


def qaoa_ring_circuit(*, qubits: int, reps: int):
    from qiskit.circuit.library import QAOAAnsatz

    cost = ring_maxcut_hamiltonian(qubits)
    ansatz = QAOAAnsatz(cost, reps=reps)
    return ansatz, cost


def estimate_problem_stats(qubits: int, reps: int) -> dict:
    """Rough teaching stats for how QAOA depth grows with knobs."""
    params = 2 * reps * qubits
    # QAOA depth scales ~ O(reps * qubits) for this ansatz family
    depth_order = reps * qubits * 4
    return {
        "qubits": qubits,
        "qaoaReps": reps,
        "parameterCount": params,
        "approxCircuitDepth": depth_order,
        "searchSpaceSize": 2**qubits,
    }
