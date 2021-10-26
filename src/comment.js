import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import { red } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';

class Comment extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            comment: props.comment,
            
        }
    }

    render() {
        return (
            <List
                sx={{
                    width: '100%',
                    maxWidth: 500,
                    bgcolor: 'background.paper',
                }}
            >
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <Avatar sx={{ bgcolor: red[200] }} aria-label="avatat">
                                {this.props.comment.username.charAt(0).toUpperCase()}
                            </Avatar>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={this.props.comment.text} secondary={"@" + this.props.comment.username} />
                </ListItem>
                <Divider variant="inset" component="li" />
            </List>
        );
    }
}

export default Comment;