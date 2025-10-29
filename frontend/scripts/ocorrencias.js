document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.getElementById("cards");
  const endpoint = "http://localhost:3000/ocorrencias/listar"; // <- substitua pela URL do seu backend
  const finalizarEndpoint = "http://localhost:3000/ocorrencias/finalizar";

  function esc(text) {
    if (text == null) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // toast popup (simples, in-line CSS)
  function showToast(message, type = "success", duration = 3000) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.style.position = "fixed";
      container.style.top = "20px";
      container.style.right = "20px";
      container.style.zIndex = "12000";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "10px";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.padding = "10px 14px";
    toast.style.borderRadius = "10px";
    toast.style.color = "#fff";
    toast.style.fontWeight = "700";
    toast.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-8px)";
    toast.style.transition = "opacity 220ms ease, transform 220ms ease";

    if (type === "success") {
      toast.style.background = "linear-gradient(90deg,#2e7d32,#1b5e20)"; // verde
    } else if (type === "error") {
      toast.style.background = "linear-gradient(90deg,#d62828,#b52323)"; // vermelho
    } else {
      toast.style.background = "rgba(0,0,0,0.75)";
    }

    container.appendChild(toast);

    // force frame to trigger transition
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";
      toast.addEventListener(
        "transitionend",
        () => {
          toast.remove();
          // remove container if empty
          if (container && container.children.length === 0) container.remove();
        },
        { once: true }
      );
    }, duration);
  }

  // formata Date/ISO para dd/MM/yyyy HH:mm
  function pad(n) {
    return String(n).padStart(2, "0");
  }
  function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return `${pad(d.getDate())}/${pad(
      d.getMonth() + 1
    )}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // normaliza texto removendo acentos e forçando minúsculas
  function normalizeType(t) {
    if (!t) return "";
    return String(t)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // retorna classe CSS baseada no tipo
  function getTypeClass(tipo) {
    const n = normalizeType(tipo);
    if (
      n.includes("atendimento") ||
      n.includes("pre-hospitalar") ||
      n.includes("prehospitalar")
    )
      return "type-atendimento";
    if (n.includes("incendio") || n.includes("incêndio"))
      return "type-incendio";
    if (n.includes("salvamento")) return "type-salvamento";
    if (n.includes("produtos") || n.includes("perigosos"))
      return "type-perigosos";
    if (n.includes("prevencao") || n.includes("prevenção"))
      return "type-prevencao";
    return "";
  }

  function openModal(o) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "ocorrencia-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "modal-card";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const typeCls = getTypeClass(o.TipoOcorrencia);

    // Note os data-value nos spans para preservar valores originais
    modal.innerHTML = `
      <div class="modal-header">
        <h3>Detalhes da Ocorrência</h3>
        <button class="close-btn" id="btn-fechar" aria-label="Fechar">✕</button>
      </div>

      <div class="modal-body">
        <div class="details">
          <div class="field"><b>Nome:</b> <span data-value="${esc(
            o.NomeCompleto || ""
          )}">${esc(o.NomeCompleto || "")}</span></div>
          <div class="field"><b>Telefone 1:</b> <span data-value="${esc(
            o.Telefone1 || ""
          )}">${esc(o.Telefone1 || "")}</span></div>
          <div class="field"><b>Telefone 2:</b> <span data-value="${esc(
            o.Telefone2 || ""
          )}">${esc(o.Telefone2 || "-")}</span></div>
          <div class="field"><b>Tipo:</b> <span data-value="${esc(
            o.TipoOcorrencia || ""
          )}">${esc(o.TipoOcorrencia || "")}</span></div>
          <div class="field"><b>Equipe:</b> <span data-value="${esc(
            o.EquipeAssociada || ""
          )}">${esc(o.EquipeAssociada || "")}</span></div>
          <div class="field"><b>Data/Hora:</b> <span class="meta">${esc(
            formatDate(o.data_hora) || ""
          )}</span></div>

          <div style="margin-top:8px;"><b>Observações:</b>
            <div class="obs" data-value="${esc(o.Obs || "")}">${esc(
      o.Obs || ""
    )}</div>
          </div>
        </div>

        <aside class="summary">
          <div class="tag ${typeCls}">${esc(
      o.TipoOcorrencia || "Ocorrência"
    )}</div>
          <div class="status"><b>Status:</b> <span class="status-value" data-status="${esc(
            o.Status || ""
          )}">${esc(o.Status || "")}</span></div>
          <div class="field"><b>Telefone para contato:</b> <span>${esc(
            o.Telefone1 || ""
          )}</span></div>
        </aside>
      </div>

      <div class="modal-actions">
        <button class="btn ghost" id="btn-fechar-action">Fechar</button>
        <button class="btn danger" id="btn-excluir">Excluir</button>
        <button class="btn secondary" id="btn-editar">Editar</button>
        <button class="btn primary" id="btn-finalizar">Finalizar Ocorrência</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // fechar ao clicar fora do modal
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay) closeModal();
    });

    // botões
    const btnFechar = document.getElementById("btn-fechar");
    const btnFecharAction = document.getElementById("btn-fechar-action");
    const btnFinalizar = document.getElementById("btn-finalizar");
    const btnEditar = document.getElementById("btn-editar");
    const btnExcluir = document.getElementById("btn-excluir");
    const statusValueEl = modal.querySelector(".status-value");

    // declara ocId cedo para uso nas funções
    const ocId = o.id || o._id;

    if (btnFechar) btnFechar.addEventListener("click", () => closeModal());
    if (btnFecharAction)
      btnFecharAction.addEventListener("click", () => closeModal());

    // Estado de edição
    let isEditing = false;

    // Função para transformar apenas telefones e observações em editáveis
    function enableEditing() {
      // telefones
      const fieldElements = Array.from(modal.querySelectorAll(".field"));
      fieldElements.forEach((f) => {
        const label = f.querySelector("b")?.textContent?.toLowerCase() || "";
        if (label.includes("telefone 1") || label.includes("telefone1")) {
          const span = f.querySelector("span");
          const value = span?.getAttribute("data-value") || "";
          const input = document.createElement("input");
          input.name = "Telefone1";
          input.value = value;
          input.className = "field-edit";
          span?.parentNode?.replaceChild(input, span);
        } else if (
          label.includes("telefone 2") ||
          label.includes("telefone2")
        ) {
          const span = f.querySelector("span");
          const value = span?.getAttribute("data-value") || "";
          const input = document.createElement("input");
          input.name = "Telefone2";
          input.value = value === "-" ? "" : value;
          input.className = "field-edit";
          span?.parentNode?.replaceChild(input, span);
        }
      });

      // observações
      const obsEl = modal.querySelector(".obs");
      if (obsEl) {
        const value = obsEl.getAttribute("data-value") || "";
        const textarea = document.createElement("textarea");
        textarea.name = "Obs";
        textarea.className = "obs-edit";
        textarea.value = value;
        obsEl.parentNode.replaceChild(textarea, obsEl);
      }

      // Atualiza botões
      btnEditar.textContent = "Salvar Alterações";
      btnEditar.classList.remove("secondary");
      btnEditar.classList.add("primary");
      if (btnFinalizar) btnFinalizar.style.display = "none";
      isEditing = true;
    }

    // Função para coletar apenas os campos permitidos (telefones + obs)
    function getEditedData() {
      if (!ocId) throw new Error("ID da ocorrência não definido");

      return {
        id: ocId,
        Telefone1:
          modal.querySelector("input[name='Telefone1']")?.value.trim() || "",
        Telefone2:
          modal.querySelector("input[name='Telefone2']")?.value.trim() || "",
        Obs: modal.querySelector("textarea[name='Obs']")?.value.trim() || "",
      };
    }

    if (btnEditar) {
      btnEditar.addEventListener("click", async () => {
        if (!isEditing) {
          enableEditing();
          return;
        }

        // Captura dados editados
        const editedData = getEditedData();

        // valida Telefone1 (obrigatório segundo schema)
        if (!editedData.Telefone1) {
          showToast("Telefone 1 é obrigatório", "error");
          return;
        }

        try {
          const res = await fetch("http://localhost:3000/ocorrencias/editar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editedData),
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data.error || `Erro ${res.status}`);
          }

          // Atualiza card na lista se existir
          const cardEl = document.querySelector(`[data-id="${ocId}"]`);
          if (cardEl) {
            const cardDesc = cardEl.querySelector("p");
            if (cardDesc) cardDesc.textContent = editedData.Obs;
          }

          showToast("Ocorrência atualizada com sucesso", "success");
          setTimeout(() => closeModal(), 700);
        } catch (err) {
          console.error("Erro ao editar ocorrência:", err);
          showToast("Falha ao salvar alterações", "error");
        }
      });
    }

    if (btnFinalizar) {
      btnFinalizar.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        if (!ocId) {
          btnFinalizar.textContent = "ID ausente";
          setTimeout(
            () => (btnFinalizar.textContent = "Finalizar Ocorrência"),
            1200
          );
          return;
        }

        // feedback UI
        btnFinalizar.setAttribute("disabled", "true");
        const prevText = btnFinalizar.textContent;
        btnFinalizar.textContent = "Finalizando...";

        try {
          const res = await fetch(finalizarEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: ocId }),
          });

          if (!res.ok) {
            throw new Error(`Resposta ${res.status}`);
          }

          // opcional: resposta do backend
          const result = await res.json().catch(() => ({}));
          const novoStatus = result.Status || "Finalizada";

          // atualiza status no modal
          if (statusValueEl) {
            statusValueEl.textContent = novoStatus;
            statusValueEl.setAttribute("data-status", novoStatus);
          }

          // atualiza status no card na lista principal (se existir)
          const cardEl = document.querySelector(`[data-id="${ocId}"]`);
          if (cardEl) {
            const cardStatus = cardEl.querySelector(".status");
            if (cardStatus) {
              cardStatus.textContent = novoStatus;
              // atualiza também o objeto original para futuras aberturas do modal
              o.Status = novoStatus;
            }
          }

          // feedback positivo
          showToast("Ocorrência finalizada com sucesso", "success");
          btnFinalizar.textContent = "Finalizada";
          btnFinalizar.setAttribute("disabled", "true");
        } catch (err) {
          console.error("Erro ao finalizar ocorrência:", err);
          showToast("Falha ao finalizar ocorrência", "error");
          btnFinalizar.textContent = "Erro";
          setTimeout(() => {
            btnFinalizar.textContent = prevText;
            btnFinalizar.removeAttribute("disabled");
          }, 1400);
        }
      });
    }

    if (btnExcluir) {
      btnExcluir.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        if (!ocId) {
          showToast("ID ausente", "error");
          return;
        }

        // confirmação simples
        const ok = confirm("Deseja realmente excluir esta ocorrência?");
        if (!ok) return;

        btnExcluir.setAttribute("disabled", "true");
        const prev = btnExcluir.textContent;
        btnExcluir.textContent = "Excluindo...";

        try {
          const res = await fetch("http://localhost:3000/ocorrencias/excluir", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: ocId }),
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data.error || `Erro ${res.status}`);
          }

          // remove card da lista se existir
          const cardEl = document.querySelector(`[data-id="${ocId}"]`);
          if (cardEl) cardEl.remove();

          showToast("Ocorrência excluída", "success");
          setTimeout(() => closeModal(), 700);
        } catch (err) {
          console.error("Erro ao excluir ocorrência:", err);
          showToast("Falha ao excluir ocorrência", "error");
          btnExcluir.textContent = prev;
          btnExcluir.removeAttribute("disabled");
        }
      });
    }

    function closeModal() {
      overlay.remove();
    }
  }

  function createCard(o) {
    const div = document.createElement("div");
    div.className = "card";
    div.style.cursor = "pointer";
    const ocId = o.id;
    if (ocId) div.setAttribute("data-id", ocId);

    const typeCls = getTypeClass(o.TipoOcorrencia);

    const tag = document.createElement("span");
    tag.className = `tag ${typeCls}`;
    tag.innerHTML = esc(o.TipoOcorrencia || "Ocorrência");

    const status = document.createElement("span");
    status.className = "status";
    status.textContent = o.Status || "";

    const p = document.createElement("p");
    p.textContent = o.Obs || "";

    const small = document.createElement("small");
    small.textContent = formatDate(o.data_hora) || "";

    div.appendChild(tag);
    div.appendChild(status);
    div.appendChild(p);
    div.appendChild(small);

    // abre modal com detalhes ao clicar no card
    div.addEventListener("click", () => openModal(o));

    return div;
  }

  function showError(msg) {
    cardsContainer.innerHTML = `<div class="card"><p>${esc(msg)}</p></div>`;
  }

  // fetch ocorrências
  fetch(endpoint)
    .then((response) => {
      if (!response.ok) throw new Error(`Erro ${response.status}`);
      return response.json();
    })
    .then((data) => {
      // espera um array de ocorrências
      if (!Array.isArray(data) || data.length === 0) {
        showError("Nenhuma ocorrência encontrada.");
        return;
      }

      // limpa container e insere cards
      cardsContainer.innerHTML = "";
      data.forEach((o) => cardsContainer.appendChild(createCard(o)));
    })
    .catch((err) => {
      console.error("Falha ao carregar ocorrências:", err);
      showError(
        "Falha ao carregar ocorrências. Veja o console para mais detalhes."
      );
    });
});
