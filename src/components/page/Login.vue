<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="loginForm" :rules="rules" ref="login" label-width="0px" class="ms-content">

                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="loginForm.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 60px;text-align: center">
                    <el-button style="width: 45%" type="primary" @click="submitForm()" :loading="loading">登录</el-button>

                    <el-button style="width: 45%" type="primary" @click.native.prevent="handleTry">
                        注册
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {isvalidUsername} from '@/utils/validate';
    import { setCookie } from '@/utils/support';
    import store from '@/store'
export default {
    data: function() {

        const validateUsername = (rule, value, callback) => {
            if (!isvalidUsername(value)) {
                callback(new Error('请输入正确的用户名'))
            } else {
                callback()
            }
        };
        const validatePass = (rule, value, callback) => {
            if (value.length < 3) {
                callback(new Error('密码不能小于3位'))
            } else {
                callback()
            }
        };

        return {
            loading: false,
            loginForm: {
                username: 'admin',
                password: 'E4w6bemu/TxxxpmNmfqe7VowZKSm4ixdrfYm4N66wEZBkm7AOWTFHGHT0Qyg+7BNZtJKfAqfLtU5qu0oyZ2iaA==',
            },
            rules: {
                username: [{required: true, trigger: 'blur', validator: validateUsername}],
                password: [{required: true, trigger: 'blur', validator: validatePass}]
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.loading = true;

                    console.log(store)

                    store.dispatch('Login', this.loginForm).then(()=>{
                        this.loading = false;
                        setCookie("username",this.loginForm.username,15);
                        setCookie("password",this.loginForm.password,15);

                        localStorage.setItem('ms_username', this.loginForm.username);

                        this.$router.push('/');
                    }).catch(()=>{
                        this.loading = false;
                    })

                } else {
                    console.log('参数验证不合法！');
                    return false;
                }
            });
        },
        //注册
        handleTry(){
            console.log("这是注册")
        },

    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
