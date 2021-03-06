import Taro,{ Component } from '@tarojs/taro'
import { View,Text } from '@tarojs/components'
import { getNode,computedTime } from '../../utils/utils'
import { AtList, AtListItem,AtNavBar  } from 'taro-ui'
import { observer, inject } from '@tarojs/mobx'
import './detail.less'

@inject('counterCollect')
@inject('counterViewList')
@observer
export default class Detail extends Component{

    state = {
        isH5: process.env.TARO_ENV === 'h5',
        collect: false,
        detail: ''
    }

    constructor(props){
        super(props);
        const { counterCollect: { collectList } } = this.props;
        const { id } = this.$router.params
        const newArr = collectList.slice(0).filter( v => v.id === id );
        if ( newArr.length > 0 ) {
            this.setState({
                collect: true
            })
        }

    }

    componentDidMount(){
        const id = this.$router.params.id;
        console.log(id);
        getNode('topic/'+id).then( res => {
            console.log(res);
            this.setState({
                detail: res.data.data
            })
        })
    }

    handleBackClick = () => {
        Taro.navigateBack(-1);
    }

    handleCollectClick = () => {
        const { collect } = this.state;
        const { counterCollect } = this.props;
        const { counterViewList: { viewList } } = this.props;
        const id = this.$router.params.id;
        const list = viewList.filter( v => v.id === id )[0];
        if ( collect ) {
            counterCollect.deleteCollect(list);
        } else {
            counterCollect.addCollect(list); 
        }
        this.setState({ 
            collect: !this.state.collect
        })     
    }

    // 根据tab字段，变成汉字
    changeType = (type) => {
        switch(type){
            case 'good':
                return '精华';
                break;
            case 'share':
                return '分享'
                break;
            case 'ask':
                return '问答'
                break;
            case 'job':
                return '招聘'
                break;
        }
    }

    render(){
        const { detail,collect,isH5 } = this.state; 
        return(
            <View className='detailTopWrap'>
                {
                    isH5 ?                 
                    <AtNavBar
                        onClickRgIconSt={ this.handleCollectClick }
                        onClickLeftIcon={ this.handleBackClick }
                        color='#000'
                        title={ detail.title }
                        leftIconType='chevron-left'
                        rightFirstIconType={ collect ? 'heart-2' : 'heart' }
                    /> : null
                }

                <View className='acticle_h3'>{ detail.title }</View>
                <View className='basicInfoWrap'>
                    <View className='at-article__info'>发布于{ computedTime(detail.create_at) }</View>
                    <View className='at-article__info'>{ detail.visit_count }次浏览 </View>
                    
                    {
                        detail.author ? <View className='at-article__info'>发布人{ detail.author.loginname } </View> : null
                    }
                    <View className='at-article__info'>来自 { this.changeType(detail.tab) }</View>
                </View>
                <View className='divideLine'></View>
                <View className='detailHtmlWrap' dangerouslySetInnerHTML={{ __html: detail.content}}></View>
                {
                    detail.replies ? <Text>{ detail.replies.length }条回复</Text> : null
                }
                
                <AtList>
                    { 
                        detail.replies ?                   
                        detail.replies.map( (v,ind) => {
                            return (
                                <AtListItem
                                    className='commentWrap'
                                    thumb={ v.author.avatar_url }
                                    title={ v.author.loginname + ind+1 }
                                    note={ <View className='commentDetailWrap' dangerouslySetInnerHTML={{__html: v.content}}></View> }
                                >
                                    
                                </AtListItem>
                            )
                        }) : null
                    }
                </AtList>

            </View>
        )
    }
}