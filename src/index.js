import React from 'react';
import ReactDOM from 'react-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import PostCard from './postCard';
import NewPost from './newPost';
import { CONSTANTS } from './constants';
import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      cards: [],
      open: false
    }
    this.fetchAllPost = this.fetchAllPost.bind(this);
    this.handleNewPost = this.handleNewPost.bind(this);
    this.compareDate = this.compareDate.bind(this);
    this.getCards = this.setCards.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.addCard = this.addCard.bind(this);
  }
  handleToggle() {
    this.setState({ open: !this.state.open });
  }
  handleClickOpen() {
    this.setState({ open: true });
  };
  handleClose() {
    this.setState({ open: false });
  };

  componentDidMount() {
    this.fetchAllPost();

  }

  compareDate(a, b) {
    return (new Date(b.timestamp)) - (new Date(a.timestamp));
  }

  fetchAllPost() {
    fetch(CONSTANTS.baseUrl + CONSTANTS.getAllPostsUrl)
      .then(res => res.json())
      .then((data) => {
        const newData = data.sort(this.compareDate);
        this.setCards(newData);
      });
  }

  async handleNewPost(newData) {
    this.addCard(newData);
  }
  handleReactionChange() {
    this.fetchAllPost();
  }

  addCard(cardData) {
    var cards = this.state.posts;
    cards[cards.length] = cardData;
    cards = cards.sort(this.compareDate);
    console.log(cards);
    this.setCards(cards);
  }

  setCards(data) {
    const cards = [];
    for (let index in data) {
      cards.push(<PostCard key={index} dataParentToChild={data[index]} onNewReaction={this.handleReactionChange} />);
    }
    this.setState({ cards: cards, posts: data });
  }


  render() {
    return (
      <div className="body">
        <div className="header">
          <NewPost onNewPost={this.handleNewPost} />
        </div>
        <StyledEngineProvider injectFirst>
          {this.state.cards}
        </StyledEngineProvider>
      </div>


    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));