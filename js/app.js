//api utilizada ---> https://min-api.cryptocompare.com/documentation

//crear un promise
const obtenercriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas);
})

const criptoselect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const monedaselect = document.querySelector('#moneda');

const resultado = document.querySelector('#resultado');

const objbusqueda={
    moneda:'',
    criptomoneda:''
}

document.addEventListener('DOMContentLoaded', ()=>{
    consultarCriptomonedas();
    formulario.addEventListener('submit',submitformulario);

    criptoselect.addEventListener('change',leervalor);//cuando el usuario seleccione una  una moneda se ejecuta
    monedaselect.addEventListener('change',leervalor);
})

function consultarCriptomonedas(){
    //const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=5&tsym=USD';
    const url ='https://min-api.cryptocompare.com/data/top/totaltoptiervolfull?limit=5&tsym=USD'
    
    fetch(url)// se ejecuta un prom
        .then( respuesta => respuesta.json())//la respuesta es un json
        // .then(resultad=> console.log(resultad.Data))
        // .then( resultado => obtenercriptomonedas(resultado.Data))//se cres un nuevo promise es   es obccional
        // .then(resultadocripto => console.log(resultadocripto))
        .then(resultadocripto => selectcriptomonedas(resultadocripto.Data))//se crea una funcion y se pasa el resultado
}
function selectcriptomonedas(resultacodripto){
    resultacodripto.forEach(cripto => {
            // console.log(cripto);
        const {FullName, Name} =  cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptoselect.appendChild(option);

    });
}


function submitformulario(e){
    e.preventDefault();
    // validar
    const {moneda,criptomoneda} =objbusqueda;

    if(moneda == ''|| criptomoneda ===''){
        mostraralerta('Ambos campos son obligatorios');
        return;
    }
    //consultar api

    consultarapi();

}
function mostraralerta(mensaje){
    const exiterror = document.querySelector('.error');
    if(!exiterror){
        const divmensaje = document.createElement('div');
        divmensaje.classList.add('error');

        // mensaje de error
        divmensaje.textContent = mensaje;
        formulario.appendChild(divmensaje);
        setTimeout(()=>{
            divmensaje.remove();
        },3000)

    }
}

function leervalor(e){    
    //  console.log(e.target.name);
    objbusqueda[e.target.name] = e.target.value; //en ell select el campo criptomoneda tienen el mismo nombre  en el name por eso se mapean
    // console.log(objbusqueda);
};


function consultarapi(){
    const {moneda,criptomoneda} = objbusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then (cotizacion =>{
            // console.log(cotizacion.DISPLAY[criptomoneda][moneda]);
            mostrarcotizacionhtml(cotizacion.DISPLAY[criptomoneda][moneda]);            
        })
}

function mostrarcotizacionhtml(cotizacion){
    // console.log(cotizacion);
    limpiarhtml();
    
    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} =cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML =`El precio es : <span>${PRICE}</span>`;

    const precioalto = document.createElement('p');
    precioalto.innerHTML=`El precio mas alto del dia es: <span>${HIGHDAY} </span>`;

    const precibajo = document.createElement('p');
    precibajo.innerHTML=`El precio mas bajo del dia es: <span>${LOWDAY} </span>`;
    
    const ultimashoras = document.createElement('p');
    ultimashoras.innerHTML=`Variacion ultimas 24hr: <span>${CHANGEPCT24HOUR} %</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioalto);
    resultado.appendChild(precibajo);
    resultado.appendChild(ultimashoras);
}

function limpiarhtml(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}
