<template>
    <div class="bg-white">
        <LoaderModal :showloader="loading" message="Adding audio file..."></LoaderModal>
        <v-dialog v-model="show" width="700" persistent data-app>
            <div class="modal-header">
                <h3>Upload Picture</h3>
                <a class="close" @click="close()">
                    <i class="material-icons">close</i>
                </a>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-5">
                        <h3 class="section-title mt0 mb8">Choose File</h3>
                        <input type="file" @change="fileUploaded" accept="audio/mp3" ref="fileUpload" />
                    </div>
                </div>
                <button v-if="upload.chosen" class="btn btn-secondary btn-filled" :disabled="loading || !isValid" @click="uploadFile">
                    <i class="material-icons">crop</i> <span class="ml16">Upload</span>
                </button>
            </div>
        </v-dialog>
    </div>
</template>

<script>
import LoaderModal from '@/webapp/common/modals/LoaderModal.vue';

export default {
    name: 'FileUpload',
    props: ['config','show','data'],
    components: {
        LoaderModal
    },
    data() {
        return {
            loading: false,
            upload: {
                chosen: null,
                src: null,
            },
            isValid: false
        };
    },
    methods: {
        callAPI(formData) {
            return new Promise(async (resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('POST', window.endpoint + this.config.api, true);
                xhr.setRequestHeader('Accept-Type', 'application/json');
                xhr.setRequestHeader('Authorization', 'bearer ' + this.$cookies.get('token'));
                xhr.onload = () => {
                    if (xhr.status !== 200) {
                        return reject({
                            code: xhr.status,
                            data: xhr.statusText
                        });
                    } else {
                        resolve(xhr.response);
                    }
                };
                xhr.onerror = () => {
                    this.loading = false;
                };
                xhr.send(formData);
            });
        },
        close(file){
            this.$emit('close', file);
        },
        fileUploaded() {
            this.isValid = false;
            this.upload.chosen = this.$refs.fileUpload.files[0];
            if (this.config.maxSize && this.upload.chosen.size > 1024 * 1024 * this.config.maxSize) {
                this.$swal('Warning', 'File exceeds the minimum size of ' + this.config.maxSize + ' MB', 'warning');
                return;
            }
            this.isValid = true;
        },
        async uploadFile() {
            this.loading = true;
            this.data.name = this.$refs.fileUpload.files[0].name;
            let formData = new window.FormData();
            formData.append('file', this.upload.chosen);
            formData.append('media', JSON.stringify(this.data));
            try {
                let result = await this.callAPI(formData);
                this.loading = false;
                this.close(JSON.parse(result));
                this.$swal({
                    title: 'Uploaded',
                    text: 'File has been uploaded successfully',
                    type: 'success',
                    confirmButtonColor: '#ff6500'
                });
            } catch (err) {
                this.loading = false;
                this.$swal({
                    title: 'Error',
                    text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                    type: 'error'
                });
            }
        }
    },
};
</script>

<style>

</style>
