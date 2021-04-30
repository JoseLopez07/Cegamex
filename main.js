const boton = document.getElementById("btn-inicio-sesion");

boton.addEventListener("click", async (event) => {
  event.preventDefault();
  const correo = document.getElementById("exampleInputEmail");
  const pass = document.getElementById("exampleInputPassword");
  console.log(correo);
  console.log(pass);
  const data = { correo: correo.value, pass: pass.value };
  const opciones = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  const respuesta = await fetch("/login", opciones);
  const datos = await respuesta.json();
  
  if (datos.login) {
    window.location = "inicio.html";
    //alert(datos.login);
  } else {
    alert("Datos incorrectos");
    correo.value = "";
    pass.value = "";
  }
});