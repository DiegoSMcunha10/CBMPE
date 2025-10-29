// Espera o documento HTML carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('occurrenceForm');

    form.addEventListener('submit', (event) => {
        // Impede o envio padrão do formulário (que recarregaria a página)
        event.preventDefault(); 

        // Coleta dos dados do formulário
        const formData = {
            nome: document.getElementById('nomeCompleto').value,
            telefone1: document.getElementById('telefone1').value,
            telefone2: document.getElementById('telefone2').value,
            descricao: document.getElementById('descricao').value,
            tipo: document.getElementById('tipoOcorrencia').value,
            equipe: document.getElementById('equipeAssociada').value
        };

        // Validação simples (todos os campos 'required' já fazem isso, 
        // mas é bom ter uma verificação extra)
        if (!formData.nome || !formData.telefone1 || !formData.telefone2 || !formData.descricao || !formData.tipo || !formData.equipe) {
            alert('Por favor, preencha todos os campos obrigatórios (*).');
            return;
        }

        const novaOcorrencia = {
            NomeCompleto: formData.nome,
            Telefone1: formData.telefone1,
            Telefone2: formData.telefone2,
            Obs: formData.descricao,
            TipoOcorrencia: formData.tipo,
            EquipeAssociada: formData.equipe
        };

        // Envio dos dados para o backend usando Fetch API
        fetch('http://localhost:3000/ocorrencias/criar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaOcorrencia)
        })
        .then(response => {
            if (response.ok) {
                alert('Ocorrência criada com sucesso!');
            } else {
                alert('Erro ao criar ocorrência.');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao criar ocorrência.');
        });

        // Opcional: Limpa o formulário após o envio
        form.reset();
    });

});