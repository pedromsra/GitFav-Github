import { GithubSearch } from "./githubsearch.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@gitfav:')) || [] //pegar JSON strin e transforma em objetos JS
        console.log(this.entries[0])
        this.nofav()
        
    } //para esse projeto estamos pegando da localStorage do navegador

    save () {
        localStorage.setItem('@gitfav:', JSON.stringify(this.entries)) //pegar objetos das entries e transformar em string JSON
    } //para esse projeto estamos salvando na localStorage do navegador

    async add(username) {
        try {
            const userExist = this.entries.find(entry => entry.login === username)

            if(userExist) {
                throw new Error('Usuário já adicionado')
            }

            const user = await GithubSearch.search(username)

            if(user.login == undefined) {
                throw new Error('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]

            this.update()
            this.save()
        } catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login) //retorna cada entry que for diferente de user

        this.entries = filteredEntries

        this.nofav()

        this.update()
        this.save()
    }

    nofav() {
        if(this.entries[0] === undefined){
            this.root.querySelector('.noFavAdded').classList.remove('hiden')
            console.log('oi');
        } else {
            this.root.querySelector('.noFavAdded').classList.add('hiden')
            console.log('oiasdasd');
        }
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onAdd()
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow(user)

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja remover esse favorito?')
                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
            this.nofav()
        })


    }

    onAdd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input') //pegar o objeto value de dentro do .search input
            this.add(value)
        }
    }

    removeAllTr () {
        this.tbody.querySelectorAll('tr').forEach((tr) => {tr.remove()})
    }

    createRow(user) {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/${user.login}.png" alt="">
                <div>
                    <p>${user.name}</p>
                    <span>/${user}</span>
                </div>
            </td>
            <td>${user.public_repos}</td>
            <td>${user.followers}</td>
            <td><button class="remove">Remover</button></td>
        `

        return tr
    }

}