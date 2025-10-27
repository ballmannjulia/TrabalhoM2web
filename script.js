const form = document.getElementById('obraForm');
const btnValidar = document.getElementById('btnValidar');
const btnLimpar = document.getElementById('btnLimpar');
const areaErros = document.getElementById('areaErros');
const listaErros = document.getElementById('listaErros');
const tBody = document.getElementById('tBody');
const detalhes = document.getElementById('detalhes');

// Array para armazenar as obras cadastradas
let obras = [];
let linhaAtualSelecionada = null;

// Função para limpar erros visuais
function limparErros() {
    areaErros.style.display = 'none';
    listaErros.innerHTML = '';

    // Remove bordas vermelhas de todos os campos
    const campos = form.querySelectorAll('input, select, textarea');
    campos.forEach(campo => {
        campo.style.border = '';
    });
}

// Função de validação
function validarFormulario() {
    limparErros();

    const erros = [];

    // Obtém valores dos campos
    const nome = document.getElementById('nome');
    const autor = document.getElementById('autor');
    const ano = document.getElementById('ano');
    const periodo = document.getElementById('periodo');
    const tipo = document.getElementById('tipo');
    const detalhamento = document.getElementById('detalhamento');

    // Validação: Nome da obra (obrigatório, mínimo 6 caracteres)
    if (!nome.value.trim()) {
        erros.push({ campo: nome, mensagem: 'Nome da obra é obrigatório' });
    } else if (nome.value.trim().length < 6) {
        erros.push({ campo: nome, mensagem: 'Nome da obra deve ter no mínimo 6 caracteres' });
    }

    // Validação: Autor (obrigatório, mínimo 10 caracteres)
    if (!autor.value.trim()) {
        erros.push({ campo: autor, mensagem: 'Autor é obrigatório' });
    } else if (autor.value.trim().length < 10) {
        erros.push({ campo: autor, mensagem: 'Nome do autor deve ter no mínimo 10 caracteres' });
    }

    // Validação: Ano (obrigatório, número válido)
    if (!ano.value.trim()) {
        erros.push({ campo: ano, mensagem: 'Ano da obra é obrigatório' });
    } else {
        const anoValor = ano.value.trim();
        const anoNumero = parseInt(anoValor);

        // Verifica se é um número válido
        if (isNaN(anoNumero) || anoNumero < 1 || anoNumero > 9999) {
            erros.push({ campo: ano, mensagem: 'Ano da obra deve ser um número válido entre 1 e 9999' });
        }
        // Verifica se tem zeros à esquerda desnecessários (022, 0022, etc)
        else if (anoValor !== anoNumero.toString()) {
            erros.push({ campo: ano, mensagem: 'Ano da obra não deve conter zeros à esquerda' });
        }
    }

    // Validação: Período (obrigatório, valor não vazio)
    if (!periodo.value || periodo.value === '') {
        erros.push({ campo: periodo, mensagem: 'Período é obrigatório' });
    }

    // Validação: Tipo (obrigatório, valor não vazio)
    if (!tipo.value || tipo.value === '') {
        erros.push({ campo: tipo, mensagem: 'Tipo é obrigatório' });
    }

    // Se houver erros, exibi-los
    if (erros.length > 0) {
        areaErros.style.display = 'block';

        erros.forEach(erro => {
            // Adiciona borda vermelha ao campo
            erro.campo.style.border = '2px solid var(--danger)';

            // Adiciona item na lista de erros
            const li = document.createElement('li');
            li.textContent = erro.mensagem;
            li.style.color = 'var(--danger)';
            listaErros.appendChild(li);
        });

        return false;
    }

    // Se validação passou, registrar a obra
    registrarObra();
    return true;
}

// Função para registrar obra
function registrarObra() {
    const obra = {
        id: Date.now(),
        nome: document.getElementById('nome').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        ano: document.getElementById('ano').value.trim(),
        periodo: document.getElementById('periodo').value,
        tipo: document.getElementById('tipo').value,
        detalhamento: document.getElementById('detalhamento').value.trim()
    };

    obras.push(obra);
    atualizarTabela();
    form.reset();

    // Feedback visual
    const msg = document.createElement('div');
    msg.textContent = '✓ Obra registrada com sucesso!';
    msg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--ok);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1000;
  `;
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.style.transition = 'opacity 0.3s';
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 300);
    }, 2000);
}

// Função para atualizar tabela
function atualizarTabela() {
    tBody.innerHTML = '';

    obras.forEach(obra => {
        const tr = document.createElement('tr');
        tr.dataset.id = obra.id;

        tr.innerHTML = `
      <td>${obra.nome}</td>
      <td>${obra.autor}</td>
      <td>${obra.ano}</td>
      <td><span class="pill">${obra.periodo}</span></td>
      <td><span class="pill">${obra.tipo}</span></td>
      <td class="td-actions">
        <button class="btn btn-del btn-excluir" data-id="${obra.id}">Excluir</button>
      </td>
    `;

        // Evento de clique na linha para mostrar detalhes
        tr.addEventListener('click', (e) => {
            // Não abre detalhes se clicou no botão excluir
            if (e.target.classList.contains('btn-excluir')) return;

            // Remove seleção anterior
            if (linhaAtualSelecionada) {
                linhaAtualSelecionada.classList.remove('selected');
            }

            // Adiciona seleção atual
            tr.classList.add('selected');
            linhaAtualSelecionada = tr;

            mostrarDetalhes(obra);
        });

        tBody.appendChild(tr);
    });

    // Adiciona eventos aos botões de excluir
    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            excluirObra(id);
        });
    });
}

// Função para mostrar detalhes
function mostrarDetalhes(obra) {
    if (obra.detalhamento) {
        detalhes.innerHTML = `
      <h3 style="color: var(--primary); margin-top: 20px; margin-bottom: 10px;">
        Detalhamento de "${obra.nome}"
      </h3>
      <p style="color: var(--text); line-height: 1.8; text-align: justify;">
        ${obra.detalhamento}
      </p>
    `;
    } else {
        detalhes.innerHTML = `
      <p style="color: var(--muted); margin-top: 20px; font-style: italic;">
        Esta obra não possui detalhamento cadastrado.
      </p>
    `;
    }
}

// Função para excluir obra
function excluirObra(id) {
    if (confirm('Deseja realmente excluir esta obra?')) {
        obras = obras.filter(obra => obra.id !== id);
        atualizarTabela();
        detalhes.innerHTML = '';
        linhaAtualSelecionada = null;
    }
}

// Event Listeners
btnValidar.addEventListener('click', validarFormulario);

btnLimpar.addEventListener('click', () => {
    limparErros();
    detalhes.innerHTML = '';
    if (linhaAtualSelecionada) {
        linhaAtualSelecionada.classList.remove('selected');
        linhaAtualSelecionada = null;
    }
});

// Limpa erros quando o usuário começa a digitar
form.addEventListener('input', () => {
    if (areaErros.style.display === 'block') {
        limparErros();
    }
});