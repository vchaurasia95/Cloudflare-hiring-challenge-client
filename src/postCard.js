import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { green } from '@mui/material/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@mui/material/Tooltip';
import Comment from './comment.js'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { CONSTANTS } from './constants.js';




const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

class PostCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      setExpanded: false,
      open: false,
      setOpen: false,
      comment: '',
      username: '',
      id: this.props.dataParentToChild.id,
      comments: this.props.dataParentToChild.post.comments,
      cards: this.updateComments(this.props.dataParentToChild.post.comments),
      like: this.props.dataParentToChild.post.reactions.like,
      dislike: this.props.dataParentToChild.post.reactions.dislike
    };
    this.data = this.state.data;
    this.handleExpandClick = this.handleExpandClick.bind(this);
    this.handlePostReaction = this.handlePostReaction.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static getDerivedStateFromProps(props, state) {

    if (props.dataParentToChild.id !== state.id) {
      return {
        id: props.dataParentToChild.id,
        comments: props.dataParentToChild.post.comments,
        like: props.dataParentToChild.post.reactions.like,
        dislike: props.dataParentToChild.post.reactions.dislike
      };
    }
    console.log('returning null')
    return null;
  }

  handleExpandClick() {
    const val = !this.state.expanded;
    this.setState({
      setExpanded: val,
      expanded: val
    });
  }

  handleClose() {
    this.setState({ open: false });
  };

  handleClickOpen() {
    this.setState({ open: true });
  };

  handlePostReaction(post_id, like, dislike, comment) {
    var request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        "post_id": post_id,
      }
    };
    if (like) {
      request.body.reaction = { like: true };
    }
    else if (dislike) {
      request.body.reaction = { dislike: true };
    }
    else {
      request.body.comment = comment;
      this.handleClose();
      this.setState({
        username: '',
        comment: ''
      });
    }

    request.body = JSON.stringify(request.body);

    fetch(CONSTANTS.baseUrl + CONSTANTS.addReactionUrl, request)
      .then(response => response.json())
      .then(async (newData) => {
        console.log(newData.post.reactions.like);
        await this.setState({
          like: newData.post.reactions.like,
          dislike: newData.post.reactions.dislike,
          cards: this.updateComments(newData.post.comments),
          comments: newData.post.comments
        });
        console.log(this.state);
        this.setState({ data: newData })
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    const comment = {
      username: this.state.username,
      text: this.state.comment
    }
    this.handlePostReaction(this.props.dataParentToChild.id, false, false, comment);
  }

  updateComments(data) {
    const comments = [];
    if (data.length > 0) {
      for (var index in data) {
        comments.push(<Comment key={index} comment={data[index]} />);
      }
    }
    return comments;
  }


  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: 5 }}>
        <Card sx={{ minWidth: 500, maxWidth: 500 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: green[500] }} aria-label="recipe">
                {this.props.dataParentToChild.username.charAt(0).toUpperCase()}
              </Avatar>
            }
            action={
              <IconButton aria-label="add comment" onClick={this.handleClickOpen}>
                <Tooltip title="Add New Comment" placement="top">
                  <AddIcon />
                </Tooltip>
              </IconButton>
            }
            titleTypographyProps={{ variant: 'h5' }}
            title={this.props.dataParentToChild.title}
            subheader={"@" + this.props.dataParentToChild.username + "  " + (new Date(this.props.dataParentToChild.timestamp).toLocaleDateString() + " " + new Date(this.props.dataParentToChild.timestamp).toLocaleTimeString())}
          />
          <CardContent>
            <Typography sx={{ fontWeight: 'bold' }} variant="body2" color="text.secondary">
              {this.props.dataParentToChild.post.text}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton onClick={(e) => this.handlePostReaction(this.props.dataParentToChild.id, true, false, null)} aria-label="Like">
              <ThumbUpIcon />{this.state.like}
            </IconButton>
            <IconButton onClick={(e) => this.handlePostReaction(this.props.dataParentToChild.id, false, true, null)} aria-label="Dislike">
              <ThumbDownIcon />{this.state.dislike}
            </IconButton>

            {this.state.comments.length > 0 ? (<ExpandMore
              expand={this.state.expanded}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="show more">
              <Tooltip title="View Comments" placement="top">
                <ExpandMoreIcon />
              </Tooltip>
            </ExpandMore>) : null}
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {this.updateComments(this.state.comments)}
            </CardContent>
          </Collapse>
        </Card>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-describedby="alert-dialog-slide-description">
          <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold' }} >{"Add New Comment"}</DialogTitle>
          <form onSubmit={this.handleSubmit}>
            <DialogContent>
              <Box
                sx={{
                  '& > :not(style)': { marginBottom: 1, width: '100%' },
                }}
                noValidate
                autoComplete="off">
                <TextField type="text" required value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} id="username" label="Username" variant="filled" />
                <TextField type="text" required value={this.state.comment} onChange={(e) => this.setState({ comment: e.target.value })} id="comment" label="Comment" variant="filled" />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose}>Cancel</Button>
              <Button type="submit" value="Submit">Submit</Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }
}

export default PostCard;
