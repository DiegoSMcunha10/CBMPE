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

        // Se tudo estiver OK, exibe os dados no console
        console.log('Formulário enviado com sucesso:');
        console.log(formData);

        // Exibe uma mensagem de sucesso para o usuário
        alert('Ocorrência registrada com sucesso!');

        // Opcional: Limpa o formulário após o envio
        form.reset();
    });

});