import React, { Component } from 'react';
import { Body,Container,Content,Header,Card,Textarea,Button,Grid,Text,Row,Col, CardItem } from "native-base";
import { CameraRoll,PermissionsAndroid,Image } from "react-native";
import { cari,upload,getTag } from "./utils/utils";
import ImagePicker from "react-native-image-crop-picker";

class Main  extends Component {

    constructor(props){
        super(props);
        this.state = {
            quotes : [],
            isLoading : false,
            image : null
        }
    }
    
   buatQuote = async () => {
    this.setState({
        isLoading : true
    })
    upload(this.state.image,(uploaded) => {
        getTag(uploaded.uploaded.id,(tag) => {
            let word = tag.results.tags[0].tag;
            cari(word, (data) => {
                this.setState({
                    quotes: data,
                    isLoading: false
                })
            }) 
        })
    })
    
   }

   pickImage = () => {
       ImagePicker.openPicker({
           compressImageQuality : 0.3
       }).then(image => {
           console.log(image);
           this.setState({
               image : {uri : image.path, width : image.width, height : image.height, mime : image.mime}
           })
       });
   }


    render(){
        let data = this.state.quotes;
        let list = [];
        data.forEach((data,key) => {
            list.push(
                <CardItem key={key}>
                    <Body>
                        <Text>
                            {data.quote}
                        </Text>
                        <Text>
                            {data.author}
                        </Text>
                    </Body>
                </CardItem>
            )
        })
        return (
            <Container>
                <Content>
                    <Card>
                        <CardItem>
                            <Image style={{ width: 300, height: 300, resizeMode: 'contain' }} source={this.state.image} />
                        </CardItem>
                        <CardItem>
                            <Grid>
                                <Col>
                                    <Button
                                        onPress={this.pickImage}
                                    >
                                        <Text>Pilih Gambar</Text>
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        onPress={this.buatQuote}
                                    >
                                        <Text>Buat Caption</Text>
                                    </Button>
                                </Col>
                            </Grid>
                        </CardItem>
                    </Card>
                    <Card>
                        {this.state.isLoading ? <Text>Loading</Text>: list }
                    </Card>
                </Content>
            </Container>
        )
    }
}

export default Main;
