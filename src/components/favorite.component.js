import Component from '../core/component'
import { apiService } from '../services/api.service'
import { renderPost } from '../templates/post.template'

export default class FavoriteComponent extends Component {
    constructor(id, loader) {
        super(id)
        this.loader = loader
    }

    init() {
        const tabFavorite = document.querySelector('.tab--favorite')
        tabFavorite.addEventListener('click', ClickFavorite)
        this.$el.addEventListener('click', linkClickHandler.bind(this))

    }

    async onShow() {
        setTimeout(() => {
            const favorites = JSON.parse(localStorage.getItem('favorites'))
            const html = renderList(favorites)
            this.$el.insertAdjacentHTML('afterbegin', html)
        }, 250)     // задержка
    }

    onHide() {
        this.$el.innerHTML = ''
    }
}

async function ClickFavorite() {
    const postNull = await apiService.fetchPosts()
    if (postNull === null) {
        localStorage.removeItem('favorites')
    }
}

async function linkClickHandler(event) {
    event.preventDefault()

    if (event.target.classList.contains('js-link')) {
        const postId = event.target.dataset.id
        this.loader.show()
        const post = await apiService.fetchPostById(postId)
        this.loader.hide()
        this.$el.insertAdjacentHTML('afterbegin', renderPost(post, { withButton: false }))
        if (postId) {
            event.target.parentElement.remove()
        }
    }
}


function renderList(list = []) {
    if (list && list.length) {
        return `
            <ul>
                ${list.map(i => `<li ><a href="#" class="js-link" data-id="${i.id}">${i.title}</a></li>`).join(' ')}
            </ul>
        `
    }
    return `<p class="center">Вы пока ничего не добавили</p>`
}