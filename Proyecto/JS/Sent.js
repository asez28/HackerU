
        const menuHamburger = document.querySelector(".menu-hamburger");
        const navLinks = document.querySelector(".nav-links")
         
        menuHamburger.addEventListener('click',()=>{
            navLinks.classList.toggle('mobile-menu')
        })

        const formulario = document.querySelector("#formulario");
        const cardsEstudiantes = document.querySelector("#cardsEstudiantes");
        const cardsProfesores = document.querySelector("#cardsProfesores");
        const templateEstudiante = document.querySelector("#templateEstudiante").content;
        const templateProfesor = document.querySelector("#templateProfesor").content;
        const alert = document.querySelector(".alert");
        
        let estudiantes = [];
        let profesores = [];
        
        document.addEventListener("click", (e) => {
            if (e.target.dataset.uid) {
                if (e.target.matches(".btn-success")) {
                    estudiantes.map((item) => {
                        if (item.uid === e.target.dataset.uid) {
                            item.setEstado = true;
                        }

                        return item;
                    });
                }
                if (e.target.matches(".btn-danger")) {
                    estudiantes.map((item) => {
                        if (item.uid === e.target.dataset.uid) {
                            item.setEstado = false;
                        }
                        console.log(item);
                        return item;
                    });
                }
                Persona.pintarPersonaUI(estudiantes, "Estudiante");
            }
        });
        
        class Persona {
            constructor(nombre, lastName, phone, address,) {
                this.nombre = nombre;
                this.phone = phone;
                this.lastName = lastName;
                this.address = address;
                this.uid = `${Date.now()}`;
                this.total = localStorage.getItem("total");
            }
        
            static pintarPersonaUI(personas, tipo) {

                if (tipo === "Estudiante") {
                    cardsEstudiantes.textContent = "";
                    const fragment = document.createDocumentFragment();
        
                    personas.forEach((item) => {
                        fragment.appendChild(item.agregarNuevoEstudiante());
                    });
        
                    cardsEstudiantes.appendChild(fragment);
                }
        
                if (tipo === "Profesor") {
                    cardsProfesores.textContent = "";
                    const fragment = document.createDocumentFragment();
                    personas.forEach((item) => {
                        fragment.appendChild(item.agregarNuevoProfesor());
                    });
                    cardsProfesores.appendChild(fragment);
                }
            }
        }
        
        class Estudiante extends Persona {
            #estado = true;
            #estudiante = "User";
        
            set setEstado(estado) {
                this.#estado = estado;
            }
        
            get getEstudiante() {
                return this.#estudiante;
            }
        
            agregarNuevoEstudiante() {
                const clone = templateEstudiante.cloneNode(true);
        
                clone.querySelector("h5 .text-primary").textContent = `${this.nombre}  ${this.lastName}`;
                clone.querySelector("h6").textContent = this.getEstudiante;
                clone.querySelector(".lead").textContent = this.phone;
                clone.querySelector(".lead1").textContent = this.address;
                clone.querySelector(".total").textContent = `₪${this.total}`;
        
                if (this.#estado) {
                    clone.querySelector(".badge").className = "badge bg-success";
                    clone.querySelector(".btn-success").disabled = true;
                    clone.querySelector(".btn-danger").disabled = false;
                } else {
                    clone.querySelector(".badge").className = "badge bg-danger";
                    clone.querySelector(".btn-danger").disabled = true;
                    clone.querySelector(".btn-success").disabled = false;
                }
                clone.querySelector(".badge").textContent = this.#estado
                    ? "Approved"
                    : "Cancel";
        
                clone.querySelector(".btn-success").dataset.uid = this.uid;
                clone.querySelector(".btn-danger").dataset.uid = this.uid;
        
                return clone;
            }
        }
        
        class Profesor extends Persona {
            #profesor = "Guest";
        
            agregarNuevoProfesor() {
                const clone = templateProfesor.cloneNode(true);
                clone.querySelector("h5").textContent = `${this.nombre}  ${this.lastName}`;
                clone.querySelector("h6").textContent = this.#profesor;
                clone.querySelector(".lead").textContent = this.phone;
                clone.querySelector(".lead1").textContent = this.address;
                clone.querySelector(".total").textContent = `₪${this.total}`;
                return clone;
            }
        }
        
        formulario.addEventListener("submit", (e) => {
            e.preventDefault();
            alert.classList.add("d-none");
        
            const datos = new FormData(formulario);
        
            const [nombre, lastName, phone, address, opcion] = [...datos.values()];
        
            if (!nombre.trim() || !lastName.trim() || !address.trim() || !phone.trim() || !opcion.trim()) {
                console.log("Elemento vacío");
                alert.classList.remove("d-none");
                return;
            }
        
            if (opcion === "Estudiante") {
                const estudiante = new Estudiante(nombre, lastName, phone, address);
                estudiantes.push(estudiante);
                Persona.pintarPersonaUI(estudiantes, opcion);
            }
        
            if (opcion === "Profesor") {
                const profesor = new Profesor(nombre, lastName, phone, address);
                profesores.push(profesor);
                Persona.pintarPersonaUI(profesores, opcion);
            }
        });
