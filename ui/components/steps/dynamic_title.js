import React, {Component} from 'react';
import Head from 'next/head';

class Title extends Component {
    render(){
        if(this.props.open)
        {
            return(
                <Head>
                    <title>Add Images</title>
                </Head> 
            );
        }
        return(
            <Head>
                <title>BOSCH</title>
            </Head> 
        );
        
    }
}
export default Title;