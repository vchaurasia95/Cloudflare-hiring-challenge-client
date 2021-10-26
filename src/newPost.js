import * as React from 'react';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { CONSTANTS } from './constants';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            open: false,
            setOpen: false,
            username: '',
            title: '',
            content: ''
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleClickOpen() {
        this.setState({ open: true });
    };
    handleClose() {
        this.setState({ open: false });
    };

    handleNewPost(post) {
        var request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: post
        };
        request.body = JSON.stringify(request.body);
        fetch(CONSTANTS.baseUrl+CONSTANTS.addNewPostUrl, request)
            .then(response => response.json())
            .then(newData => {
                this.props.onNewPost(newData);
                this.setState({
                    username:'',
                    title:'',
                    content:''
                });
                this.handleClose();
            });
    }

    handleSubmit(event) {
        event.preventDefault();
        const post = {
            username: this.state.username,
            title: this.state.title,
            post: {
                text: this.state.content
            }
        }
        this.handleNewPost(post);
    }
    render() {
        return (
            <div>
                <Button variant="contained" onClick={this.handleClickOpen}>
                    Add New Post
                </Button>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    maxWidth='sm'
                    fullWidth
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold' }} >{"New Post"}</DialogTitle>
                    <form onSubmit={this.handleSubmit}>
                        <DialogContent>
                            <Box
                                sx={{
                                    '& > :not(style)': { m: 0.25, marginBottom: 1, width: '49%' },
                                }}
                                noValidate
                                autoComplete="off">
                                <TextField type="text" inputProps={{ maxLength: 12 }} required value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} id="username" label="Username" variant="filled" />
                                <TextField type="text" inputProps={{ maxLength: 15 }} required value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} id="comment" label="Title" variant="filled" />
                            </Box>
                            <Box
                                sx={{
                                    '& > :not(style)': { marginBottom: 1, width: '100%' },
                                }}
                                noValidate
                                autoComplete="off">
                                <TextField type="text" multiline rows={4} required value={this.state.content} onChange={(e) => this.setState({ content: e.target.value })} id="comment" label="Content" variant="filled" />
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

export default NewPost;