import Taro, {Component} from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { get, showToast } from '../../utils/utils'
import NavBar from '../../components/navBar'
import './login.less'

class Login extends Component{

    config = {
        navigationBarTitleText: '登录'
    }
    
    constructor(props){
        super(props);
        this.state = {
            key: '00d91e8e0cca2b76f515926a36db68f5',
            phone: '',
            passwd: ''
        }
    }

    // 测试账号密码 13307496550 123654  13307486550  123456
    handleSubmit = () => {
        if ( this.state.phone && this.state.passwd ){
            console.log(this.state)
            get('login', this.state).then( res => {
                const { data: { code, msg, data } } = res
                const newData = { ...data };
                if ( code !== 200 ) {
                    showToast(msg)
                } else {
                    showToast('登录成功')
                    Taro.setStorageSync('person', newData);
                    Taro.redirectTo({
                        url: '/pages/person/person'
                    })
                    console.log(res);
                }
            });           
        } else {
            showToast('用户名或密码不能为空');
        }
        
    }

    handleUserInput = (val) => {
        this.setState({
            phone: val
        })
    }

    handlePasInput = (val) => {
        this.setState({
            passwd: val
        })       
    }

    handleBackClick = () => {
        Taro.navigateBack(-1);
    }

    handleGoRegist = () => {
        Taro.navigateTo({
            url: '/pages/regist/regist'
        })
    }

    render(){
        return(
            <View>
                <NavBar navTitle='登陆' />
                <AtForm>
                    <AtInput                       
                        placeholder='请输入用户名'
                        title='手机号码'
                        type='phone'
                        value={ this.state.phone }
                        onChange={ this.handleUserInput }
                    />
                   <AtInput 
                        placeholder='请输入密码'
                        title='密码'
                        type='password'
                        value={ this.state.passwd }
                        onChange={ this.handlePasInput }
                    />   
                    <AtButton 
                        className='loginBtn'
                        type='primary' 
                        onClick={ this.handleSubmit } 
                        formType='submit'
                    >登录</AtButton>
                    <AtButton 
                        className='loginBtn'
                        type='primary' 
                        onClick={ this.handleGoRegist } 
                    >注册</AtButton>                    
                </AtForm>

            </View>
        )
    }
}

export default Login;