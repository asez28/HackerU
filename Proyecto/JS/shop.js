const items = document.querySelector("#items");
const shop = document.querySelector("#carrito");
const section2 = document.querySelector('#section2');
const templateCard = document.querySelector("#templateCard").content;
const fragment = document.createDocumentFragment();
const templateCarrito = document.querySelector('#templateCarrito').content;
const templateFooter= document.querySelector('#templateFooter').content;

let carritoObjeto = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  if(localStorage.getItem('car')) {
    carritoObjeto = JSON.parse(localStorage.getItem('car'))
    drawShop();
  }
})

document.addEventListener("click",(e) =>  {
    if(e.target.matches(".card .button-85")) {
        agregarCarrito(e);
    };
    if(e.target.matches("#carrito .list-group-item .btn-outline-primary")) {
        btnIncreas(e);
    };
    if(e.target.matches("#carrito .list-group-item .btn-outline-danger")) {
        btnDecrease(e);
    }
    if(e.target.matches("#section2 div .btn-outline-warning")) {
        btnClean(e);
    }
})

items.addEventListener('click', e => {
    addCarrito(e)
})

const fetchData = async () => {
    try {
        const res = await fetch('./SHOP.json')
        const data = await res.json()
        drawCard(data)
    } catch (error) {
        console.log(error)
    }
}

const drawCard =  data => {
    data.forEach(product => {
       templateCard.querySelector('h5').textContent = product.title;
       templateCard.querySelector('.price').textContent = `₪${product.precio}`;
       templateCard.querySelector('.price').setAttribute("id", product.precio);
       templateCard.querySelector('iframe').setAttribute("src", product.video);
       templateCard.querySelector('img').setAttribute("src", product.thumbnailUrl);
       templateCard.querySelector('.button-85').dataset.id = product.id;

       const clone = templateCard.cloneNode(true)
       fragment.appendChild(clone)
    })

    items.appendChild(fragment)
};

const addCarrito = e => {
    if(e.target.classList.contains('button-85')) {
       setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = item => {
    const element = {
        id: item.querySelector('.button-85').dataset.id,
        title: item.querySelector('h5').textContent,
        price: item.querySelector('.price').id,
        img: item.querySelector('img').src,
        cantidad: 1
    }

    console.log(element.price)
    const index = carritoObjeto.findIndex((item) => item.id === element.id);

    if (index === -1) {
        carritoObjeto.push(element);
    } else {
        carritoObjeto[index].cantidad++;
    }

    drawShop()
    
}

const drawShop = () => {
    carrito.textContent = "";

    carritoObjeto.forEach((item) => {
        const clone = templateCarrito.cloneNode(true);
        clone.querySelector(".lead").textContent = item.title;
        clone.querySelector(".text-center").textContent = "🛒" + item.cantidad;
        clone.querySelector("div .lead span").textContent = item.price * item.cantidad;
        clone.querySelector(".imagen").setAttribute("src", `${item.img}`);
        clone.querySelector(".btn-outline-primary").dataset.id = item.id;
        clone.querySelector(".btn-outline-danger").dataset.id = item.id;

        fragment.appendChild(clone);

    })

    shop.appendChild(fragment);
    drawTotal()

    localStorage.setItem('car', JSON.stringify(carritoObjeto))
}

drawTotal = () => {
    section2.textContent = "";
    
    const total = carritoObjeto.reduce((acc, current) => acc + current.cantidad * current.price, 0);
    const nItems = carritoObjeto.reduce((acc, current) => acc + current.cantidad, 0);

    const clone = templateFooter.cloneNode(true); 
    clone.querySelector('span').textContent = total;
    clone.querySelector('.nCant').textContent = nItems;

    section2.appendChild(clone);

    localStorage.setItem("total", total);

}

const btnIncreas = (e) => {
    carritoObjeto = carritoObjeto.map(item => {
        if(item.id === e.target.dataset.id){
            item.cantidad++
        }
        return item;
    })
  
    drawShop()
};

const btnDecrease = (e) => {
    // console.log(e.target.dataset.id);
    carritoObjeto = carritoObjeto.filter((item) => {
        if (item.id === e.target.dataset.id) {
            if (item.cantidad > 0) {
                item.cantidad--;
                // console.log(item);
                if (item.cantidad === 0) return;
                return item;
            }
        } else {
            return item;
        }
    });
    drawShop();
};

const btnClean = (e) => {
    carritoObjeto = [];
   
    drawShop();
   };
