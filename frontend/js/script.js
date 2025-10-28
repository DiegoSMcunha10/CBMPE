function login() {
    const matricula = document.getElementById('matricula').value;
    const senha = document.getElementById('senha').value;
    if (matricula === 'admin' && senha === '1234') {
        window.location.href = 'ocorrencias.html';
    } else {
        alert('Matrícula ou senha incorreta!');
    }
}

function logout() {
    alert('Sessão encerrada!');
    window.location.href = 'index.html';
}
