import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "react-router-dom/Link";
//MUI stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography'


const styles = {
    card: {
        display: "flex",
        marginBottom:20
    },
    image:{
        minWidth:140,
        objectFit:"cover"
    },
    content:{
        padding:40
    }
}

class Scream extends Component {
    render() {
        const {classes , scream:{userHandle,userImage,time,body}} = this.props;
        return (
            <Card className={classes.card}>
                <CardMedia
                    image={userImage}
                    title="Profile image" className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typography variant="h5"
                                component={Link}
                                to={`/user/${userHandle}`} color={"primary"}>{userHandle}</Typography>
                    <Typography variant="body2" color="textSecondary">{time}</Typography>
                    <Typography variant="body1">{body}</Typography>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(Scream)