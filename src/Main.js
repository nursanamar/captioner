import React, { Component } from 'react';
import { Spinner,Body,Container,Content,Header,Card,Textarea,Button,Grid,Text,Row,Col, CardItem,Icon,Left,Right } from "native-base";
import { CameraRoll,PermissionsAndroid,Image,Clipboard } from "react-native";
import { cari,upload,getTag } from "./utils/utils";
import ImagePicker from "react-native-image-crop-picker";

class Main  extends Component {

    constructor(props){
        super(props);
        this.state = {
            quotes : [],
            isLoading : false,
            image : null,
            log : ""

        }
    }

    copyQuote = (index) => {
        let qoutelist = this.state.quotes;
        let selected = qoutelist[index];
        console.log(selected);
        let compose = selected.quote + "\n\n -" + selected.author;
        Clipboard.setString(compose);
        alert("Copied");
    }

    onError = () => {
        this.setState({
            isLoading : false
        })
        alert("Maaf sedang terjadi masalah")
    }
    
   buatQuote = async () => {
    if(this.state.image === null){
        return
    }
    this.setState({
        isLoading : true,
        log: "Mengupload gambar"
    })
    upload(this.state.image,(uploaded) => {
        this.setState({
            log: "Menganalisa Gambar"
        })
        getTag(uploaded.uploaded[0].id,(tag) => {
            let word = tag.results[0].tags;
            console.log(word,"main");
            this.setState({
                log: "Mencari Quote"
            })
            cari(word, (data) => {
                this.setState({
                    quotes: data,
                    isLoading: false
                })
                console.log(this.state)
            },this.onError) 
        },this.onError)
    },this.onError)
    
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
                <CardItem button onPress={() => { this.copyQuote(key)}} key={key}>
                    
                        <Body >
                            <Text>{"\"" + data.quote + "\"\n\n"}</Text>
                            <Text style={{ fontStyle: "italic" }} >{"-" + data.author}</Text>
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
                            {
                                this.state.isLoading ?
                                [
                                    <Spinner key={0} />,
                                    <Text key={1}>{this.state.log}</Text>
                                ]
                                :
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
                            }
                        </CardItem>
                    </Card>
                    
                        {
                            this.state.quotes ? 
                            <Card>
                                {list}
                            </Card>
                            : null
                        }
                    
                </Content>
            </Container>
        )
    }
}

export default Main;
