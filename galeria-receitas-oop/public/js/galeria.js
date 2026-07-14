// ============================================================
// 19. Envio do Formulário usando FormData (Substituindo JSON)
// ============================================================
async function criarReceita(event) {
  event.preventDefault();
  
  const formElement = document.getElementById("form-receita");
  
  // a) Instanciando o FormData com o formulário HTML
  const formData = new FormData(formElement);

  try {
    // b) Enviando o corpo como formData e SEM os headers de Content-Type
    const response = await fetch("/api/receitas", {
      method: "POST",
      body: formData
    });

    const resultado = await response.json();
    
    if (resultado.sucesso) {
      // Limpa os campos do formulário após o sucesso
      formElement.reset();
      
      // Reseta a imagem de preview (Desafio 21)
      const previewImg = document.getElementById("preview-foto");
      if (previewImg) previewImg.style.display = "none";
      
      // Executa a busca/recarregamento das receitas se a função existir
      if (typeof carregarReceitas === "function") {
        carregarReceitas();
      } else {
        window.location.reload();
      }
    } else {
      alert("Erro ao cadastrar receita: " + resultado.erro);
    }
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    alert("Não foi possível conectar ao servidor.");
  }
}

// ============================================================
// 21. Desafio Bônus: Preview da Foto Antes do Envio
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const inputFoto = document.querySelector('input[name="foto"]');
  if (inputFoto) {
    // Cria o elemento de imagem para a miniatura dinamicamente se não existir no HTML
    let previewImg = document.getElementById("preview-foto");
    if (!previewImg) {
      previewImg = document.createElement("img");
      previewImg.id = "preview-foto";
      previewImg.style.display = "none";
      previewImg.style.maxWidth = "140px";
      previewImg.style.marginTop = "10px";
      previewImg.style.borderRadius = "6px";
      previewImg.style.border = "1px solid #ddd";
      inputFoto.parentNode.appendChild(previewImg);
    }

    inputFoto.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validação básica de tipo no lado do cliente
        if (!file.type.startsWith("image/")) {
          alert("Por favor, selecione apenas arquivos de imagem.");
          inputFoto.value = "";
          previewImg.style.display = "none";
          return;
        }
        
        // Atribui a URL temporária do arquivo selecionado para a tag img
        previewImg.src = URL.createObjectURL(file);
        previewImg.style.display = "block";
      } else {
        previewImg.style.display = "none";
      }
    });
  }
});