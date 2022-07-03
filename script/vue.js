let chamber = document.querySelector("#cuerpotablasenate") ? "senate" : "house"
URLAPI = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

Vue.createApp({
    data() {
        return {
            datos: [],
            init: {
                method: "GET",
                headers: {
                    "X-API-Key": "yO3oPwSPxTNzgHAgtQSUcxs1YBj2MZ3WVGbTgWBB"
                }
            },
            checkboxesvalor: [],
            partidos: [],
            arrayestados: [],
            seleccionelegida: "",
            estadosOptions: [],
            datos:[],

        
            cantidadR : 0,
            cantidadD:0,
            cantidadID:0,

            votosR:0,
            votosD:0,
            votosID:0,
            
            cantidadtotal:0,
            porcentajetotal:0,

            mostengaged:[],
            leastengaged:[],

            mostloyal:[],
            leastloyal:[],
            
            arraycortadomostengaged:[],
            arraycortadoleastengaged:[],

            arraycortadomostloyal:[],
            arraycortadoleastloyal:[],

            diezporciento:[]
        }
    },

    created() {
        fetch(URLAPI, this.init).then(response => response.json())
            .then(data => {
                this.datos = data.results[0].members
                this.partidos = this.datos
                /* console.log(this.datos) */
                
                this.partidos.map((estado) => {
                    if(!this.estadosOptions.includes(estado.state)){
                        this.estadosOptions.push(estado.state)
                    }
                    return this.estadosOptions.sort()
                })
                this.contador()
                this.tablas()
                this.cortararray(this.mostengaged,this.arraycortadomostengaged)
                this.cortararray(this.leastengaged,this.arraycortadoleastengaged)
                this.cortararray(this.mostloyal,this.arraycortadomostloyal)
                this.cortararray(this.leastloyal,this.arraycortadoleastloyal)
            })

    },

    methods: {
       contador(){
           this.datos.forEach(miembro => {
               if(miembro.party == "ID"){
                   this.cantidadID++
                   this.votosID += miembro.votes_with_party_pct
                }

                if(miembro.party == "D"){
                    this.cantidadD++
                    this.votosD += miembro.votes_with_party_pct
                 }

                 if(miembro.party == "R"){
                    this.cantidadR++
                    this.votosR += miembro.votes_with_party_pct
                 }
            })
            this.cantidadtotal = this.cantidadR + this.cantidadD + this.cantidadID
            this.porcentajetotal = ((this.votosR + this.votosD + this.votosID)/(this.cantidadR + this.cantidadD + this.cantidadID)).toFixed(2);
            this.votosR = (this.votosR/this.cantidadR).toFixed(2);
            this.votosD = (this.votosD/this.cantidadD).toFixed(2);
            this.votosID = (this.votosID) ? (this.votosID/this.cantidadID).toFixed(2) : 0;

          
        },







        tablas(){
            this.mostengaged = this.datos.map(member => member)

            this.mostengaged.sort(function (miembro1, miembro2) {
                if (miembro1.missed_votes_pct < miembro2.missed_votes_pct) {
                    return -1
                } if (miembro1.missed_votes_pct > miembro2.missed_votes_pct) {
                    return 1
                } else {
                    return 0
                }
            })


            this.leastengaged = this.datos.map(member => member)

            this.leastengaged.sort(function (miembro1, miembro2) {
                if (miembro1.missed_votes_pct > miembro2.missed_votes_pct) {
                    return -1
                } if (miembro1.missed_votes_pct < miembro2.missed_votes_pct) {
                    return 1
                } else {
                    return 0
                }
            })

            this.diezporciento = Math.floor(this.mostengaged.length * 0.10)

            this.leastloyal = this.datos.map(member => member)

            this.leastloyal.sort(function (miembro1, miembro2) {
                if (miembro1.votes_with_party_pct < miembro2.votes_with_party_pct) {
                    return -1
                } if (miembro1.votes_with_party_pct > miembro2.votes_with_party_pct) {
                    return 1
                } else {
                    return 0
                }
            })



            this.mostloyal = this.datos.map(member => member)

            this.mostloyal.sort(function (miembro1, miembro2) {
                if (miembro1.votes_with_party_pct > miembro2.votes_with_party_pct) {
                    return -1
                } if (miembro1.votes_with_party_pct < miembro2.votes_with_party_pct) {
                    return 1
                } else {
                    return 0
                }
            })

            this.diezporciento = Math.floor(this.mostloyal.length * 0.10)
            
        },





        cortararray(array,arrayaux){
            for (let i = 0; i < this.diezporciento; i++) {
                arrayaux.push(array[i])
            }
        },

    },

    computed: {
        filtrarporpartidos() {
            this.partidos = []
            if (this.checkboxesvalor.length == 0) {
                this.partidos = this.datos
            } else {
                this.datos.forEach(miembros =>
                    this.checkboxesvalor.forEach(checkboxvalores => miembros.party == checkboxvalores ? this.partidos.push(miembros) : null))
            }
            if (this.seleccionelegida == "all" || this.seleccionelegida.length == 0) {
                this.arrayestados = this.partidos
            }

            else {
                this.arrayestados = this.partidos.filter(miembros => miembros.state == this.seleccionelegida)
                this.partidos = this.arrayestados
            }
        },

    },
   

  }).mount('#app')