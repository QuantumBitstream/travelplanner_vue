<template>
  <div class="profile-page">
    <el-card class="profile-card">
      <div class="header">
        <h2>个人资料</h2>
      </div>

      <el-form
          :model="profileForm"
          :rules="rules"
          ref="profileForm"
          label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" disabled />
        </el-form-item>

        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
        </el-form-item>

<!--        <el-form-item label="电话" prop="phone">-->
<!--          <el-input v-model="profileForm.phone" placeholder="请输入电话号码" />-->
<!--        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" @click="updateProfile">保存</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ProfileView',

  computed: {
    ...mapState('profile', {
      profileForm: state => state.profileForm,
      rules: state => state.rules
    })
  },

  methods: {
    ...mapActions('profile', [
      'loadUserProfile',
      'updateUserProfile',
      'resetProfileForm'
    ]),

    updateProfile() {
      this.$refs.profileForm.validate(async (valid) => {
        if (valid) {
          try {
            await this.updateUserProfile();
            this.$message.success('个人资料已更新！');
          } catch (error) {
            this.$message.error('更新失败，请重试');
          }
        } else {
          this.$message.warning('请填写正确的信息。');
          return false;
        }
      });
    },

    resetForm() {
      this.$refs.profileForm.resetFields();
      this.resetProfileForm();
    }
  },

  mounted() {
    this.loadUserProfile();
  }
};
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
}

.profile-card {
  width: 500px;
  padding: 40px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #333;
}
</style>
