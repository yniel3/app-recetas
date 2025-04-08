cargando()


obtenerCategorias();
function obtenerCategorias() {
    const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarCategorias(resultado.categories))
}

function mostrarCategorias(categorias = []) {  
    categorias.forEach(ele  => {
        //crear elementos en el HTML
        const { strCategory, strCategoryThumb } = ele;
        const slide = document.createElement('ARTICLE');
        slide.classList.add('swiper-slide');
        const imagen = document.createElement('IMG');
        imagen.src = strCategoryThumb;
        const enlace = document.createElement('A');
        enlace.classList.add('btnCategoria');
        enlace.textContent = strCategory;
        enlace.onclick = () => {
            mostrar(ele);
        }
        //agregando los elementos al article
        slide.appendChild(imagen);
        slide.appendChild(enlace);
        if(divSlider) {
            divSlider.appendChild(slide);
        }
    })
}

const divSlider = document.querySelector('.swiper-wrapper');
const sectRecetas = document.querySelector('.mostrador');
setTimeout(() => {
    const swiper = new Swiper('.swiper', {
        // Optional parameters
        centerInsufficientSlides: false,
        slidesPerView: 'auto',
        spaceBetween: 15,
        slidesPerGroupAuto: true,
        loop: true,
        autoplay: {
            delay: 4000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
        },
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}, 1500);

function aviso() {
    const modal = document.querySelector('.modalReceta')
    const avisoModal = document.querySelector('.avisoModal');
    if(modal.open) {
        avisoModal.style.display = 'flex'
        console.log('estoy aqui')
        setTimeout(() => {
            avisoModal.style.display = 'none'
        }, 2000);
        return
    }
    const aviso = document.querySelector('.aviso');
    aviso.style.display = 'block'
    console.log('estoy despues')
    setTimeout(() => {
        aviso.style.display = 'none'
    }, 2000);
}

const principal = document.querySelector('.principal');
const divRecetas = document.querySelector('.contenedorRecetas');
// Toma un categoria y hace una llamada a la API
// para obtener los elemento de esa categoria
function mostrar(select) {
    const { strCategoryThumb, strCategory } = select;
    //cargo mi slider
    cargando()
    //Obttengo los datos de ah mostrar en mi contenedor
    document.querySelector('.imgCategoria').src = strCategoryThumb;
    document.querySelector('.nombreCate').textContent = strCategory;
    principal.style.display = 'none';
    sectRecetas.style.display = 'flex';
    const divCategorias = document.querySelector('.swiper-wrapper');
    divCategorias.classList.add('sliderArriba');
    divCategorias.classList.remove('sliderNormal')
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${strCategory}`
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => mostrarRecetas(datos.meals))
}
// Muestra las recetas de la llamada de la API
function mostrarRecetas(recetas) {
    //limpiamos el HTML previcio si existe
    limpiarHTML(divRecetas)
    //traer todas las recetas de la categoria
    recetas.forEach(receta => {
        const { strMeal, strMealThumb, idMeal} = receta
        //Creando los elementos que va a llevar mi Elemento
        const articulo = document.createElement('ARTICLE');
        articulo.classList.add('receta');
        const imgReceta = document.createElement('IMG');
        imgReceta.classList.add('imgReceta');
        imgReceta.src = strMealThumb;
        const nameReceta = document.createElement('P');
        nameReceta.classList.add('nombreReceta');
        nameReceta.textContent = strMeal;
        const divBtns = document.createElement('DIV');
        divBtns.classList.add('botones');
        const btnVer = document.createElement("A");
        btnVer.classList.add('verReceta');
        btnVer.textContent = 'Ver receta';
        btnVer.onclick = () => {
            //Agregando un evento a los btn de los elmento
            verReceta(idMeal)
        }
        const btnAddFav = document.createElement('A');
        btnAddFav.classList.add('favorito');
        btnAddFav.onclick = () => {
            if(comprobarLS(idMeal)) {
                return
            }
            //Agregando un evento a los btn de los elmento
            guardarFavorito({id: idMeal, imagen: strMealThumb, nombre: strMeal})
        }
        //Agregar los elementos al Articule
        articulo.appendChild(imgReceta);
        articulo.appendChild(nameReceta);
        articulo.appendChild(divBtns);
        divBtns.appendChild(btnVer);
        divBtns.appendChild(btnAddFav);
        //Agregar los articulos al elemento principal
        divRecetas.appendChild(articulo);
    });
}
//limpiar HTML
function limpiarHTML(select) {
    while(select.firstChild) {
        select.removeChild(select.firstChild);
    }
}
//Hacer slider de carga
function cargando() {
    const loader = document.querySelector('.loader');
    loader.style.display = 'flex'
    setTimeout(() => {
        loader.style.display = 'none'
    }, 1000);
}
// Crear modal para mostrar la receta
function verReceta(idMeal) {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarRecetaModal(resultado.meals[0]))
}

function mostrarRecetaModal(receta) {
    const { strMealThumb, strMeal, strInstructions, idMeal } = receta;
    //agregando abre y cierre al modal
    const modal = document.querySelector(".modalReceta");
    modal.showModal();
    const btnCerrar = document.querySelector(".cerrarModal");
    btnCerrar.addEventListener("click", () => modal.close());
    // selecionando los elementos para agregar la info
    const imgModal = document.querySelector(".imgModal");
    imgModal.src = strMealThumb;
    const tituloModal = document.querySelector(".tituloModal");
    tituloModal.textContent = strMeal;
    const instrucciones = document.querySelector(".instrucciones");
    instrucciones.textContent = strInstructions;
    // btn Agregar a Favoritos y guardar en LocalStorage
    const btnFavorito = document.querySelector(".favoritoModal");
    btnFavorito.onclick = () => {
        if (comprobarLS(idMeal)) {
            return;
        }
        guardarFavorito({ id: idMeal, imagen: strMealThumb, nombre: strMeal });
    };
    //ingrediente
    const divIngrediente = document.querySelector(".ingredientes");
    limpiarHTML(divIngrediente);
    //iterando los ingrediente existentes
    for (let i = 1; i < 20; i++) {
        if (receta[`strIngredient${i}`]) {
            const ingrediente = receta[`strIngredient${i}`];
            const cantidad = receta[`strMeasure${i}`];
            // Crear el elemento con el ingrediente
            const ingreItem = document.createElement("P");
            ingreItem.classList.add("ingrediente");
            ingreItem.textContent = `${ingrediente} - ${cantidad}`;
            // agrego el ingrediente al contenedor de ingredientes
            divIngrediente.appendChild(ingreItem);
        }
    }
}

function guardarFavorito(favorito) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    localStorage.setItem("favoritos", JSON.stringify([...favoritos, favorito]));
    aviso();
}
// comprobar si existe una receta
function comprobarLS(idReceta) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    return favoritos.some((favorito) => favorito.id === idReceta);
}

const guardados = document.querySelector(".guardados");

function mostrarEnGuardados() {
    items = JSON.parse(localStorage.getItem("favoritos"));
    items.forEach((item) => {
        const { id, imagen, nombre } = item;
        const articulo = document.createElement("ARTICLE");
        articulo.classList.add("favo");
        const img = document.createElement("IMG");
        img.src = imagen;
        const name = document.createElement("P");
        name.textContent = nombre;
        const btnVer = document.createElement("BUTTON");
        btnVer.classList.add("btnGuardados");
        btnVer.textContent = "Ver receta";
        btnVer.onclick = () => {
            //Agregando un evento a los btn de los elmento
            verReceta2(id);
        };
        articulo.appendChild(img);
        articulo.appendChild(name);
        articulo.appendChild(btnVer);
        if(guardados) {
            guardados.appendChild(articulo)
        }
    });
}
function verReceta2(id) {
    console.log(id);
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    fetch(url)
        .then((respuesta) => respuesta.json())
        .then((resultado) => mostrarRecetaModal2(resultado.meals[0]));
}
function mostrarRecetaModal2(receta) {
    const { strMealThumb, strMeal, strInstructions } = receta;
    //agregando abre y cierre al modal
    const modal = document.querySelector(".modalReceta");
    modal.showModal();
    const btnCerrar = document.querySelector(".cerrarModal");
    btnCerrar.addEventListener("click", () => modal.close());
    // selecionando los elementos para agregar la info
    const imgModal = document.querySelector(".imgModal");
    imgModal.src = strMealThumb;
    const tituloModal = document.querySelector(".tituloModal");
    tituloModal.textContent = strMeal;
    const instrucciones = document.querySelector(".instrucciones");
    instrucciones.textContent = strInstructions;
    //ingrediente
    const divIngrediente = document.querySelector(".ingredientes");
    limpiarHTML(divIngrediente);
    //iterando los ingrediente existentes
    for (let i = 1; i < 20; i++) {
        if (receta[`strIngredient${i}`]) {
            const ingrediente = receta[`strIngredient${i}`];
            const cantidad = receta[`strMeasure${i}`];
            // Crear el elemento con el ingrediente
            const ingreItem = document.createElement("P");
            ingreItem.classList.add("ingrediente");
            ingreItem.textContent = `${ingrediente} - ${cantidad}`;
            // agrego el ingrediente al contenedor de ingredientes
            divIngrediente.appendChild(ingreItem);
        }
    }
}

mostrarEnGuardados()





