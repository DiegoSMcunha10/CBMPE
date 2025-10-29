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

    modal.innerHTML = `
      <div class="modal-header">
        <h3>Detalhes da Ocorrência</h3>
        <button class="close-btn" id="btn-fechar" aria-label="Fechar">✕</button>
      </div>

      <div class="modal-body">
        <div class="details">
          <div class="field"><b>Nome:</b> <span>${esc(
            o.NomeCompleto || ""
          )}</span></div>
          <div class="field"><b>Telefone 1:</b> <span>${esc(
            o.Telefone1 || ""
          )}</span></div>
          <div class="field"><b>Telefone 2:</b> <span>${esc(
            o.Telefone2 || "-"
          )}</span></div>
          <div class="field"><b>Tipo:</b> <span>${esc(
            o.TipoOcorrencia || ""
          )}</span></div>
          <div class="field"><b>Equipe:</b> <span>${esc(
            o.EquipeAssociada || ""
          )}</span></div>
          <div class="field"><b>Data/Hora:</b> <span class="meta">${esc(
            formatDate(o.data_hora) || ""
          )}</span></div>

          <div style="margin-top:8px;"><b>Observações:</b>
            <div class="obs">${esc(o.Obs || "")}</div>
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
    const statusValueEl = modal.querySelector(".status-value");

    if (btnFechar) btnFechar.addEventListener("click", () => closeModal());
    if (btnFecharAction)
      btnFecharAction.addEventListener("click", () => closeModal());

    // captura id da ocorrencia (tenta _id ou id)
    const ocId = o._id || o.id;

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

          // atualiza status no modal
          if (statusValueEl)
            statusValueEl.textContent = result.Status || "Finalizada";

          // atualiza status no card na lista principal (se existir)
          const cardEl = document.querySelector(`[data-id="${ocId}"]`);
          if (cardEl) {
            const cardStatus = cardEl.querySelector(".status");
            if (cardStatus)
              cardStatus.textContent = result.Status || "Finalizada";
          }

          // feedback positivo: toast + fecha modal
          showToast("Ocorrência finalizada com sucesso", "success");
          btnFinalizar.textContent = "Finalizada";
          setTimeout(() => closeModal(), 700);
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

    function closeModal() {
      overlay.remove();
    }
  }

  function createCard(o) {
    const div = document.createElement("div");
    div.className = "card";
    div.style.cursor = "pointer";
    const ocId = o._id || o.id || "";
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
