<template>
    <div class="bg-white">
        <LoaderModal :showloader="loading" message="Adding image file..."></LoaderModal>
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
                        <input type="file" @change="fileUploaded" accept="image/*" ref="fileUpload"/>
                    </div>
                </div>
                <div v-if="upload.src">
                    <h3 class="section-title mb0">2. Crop Image</h3>
                    <cropper classname="cropper" :src="upload.src" :stencilProps="stencilProps" @change="onChange"></cropper>
                </div>
                <div v-if="upload.src" class="mt8">
                    <h3 class="section-title mb0">3. Confirm</h3>
                    <button class="btn btn-primary btn-filled" :disabled="loading || !isValid" @click="uploadFull">
                        <i class="material-icons">crop_free</i> <span class="ml16">Upload Uncropped</span>
                    </button>
                    <button class="btn btn-secondary btn-filled" :disabled="loading || !isValid" @click="uploadCropped">
                        <i class="material-icons">crop</i> <span class="ml16">Upload Cropped</span>
                    </button>
                </div>
            </div>
        </v-dialog>
    </div>
</template>

<script>
    import {Cropper} from 'vue-advanced-cropper';
    import LoaderModal from  '@/webapp/common/modals/LoaderModal.vue';
    export default {
        name: "ImageUpload",
        props: ['show', 'config', 'data'],
        components: {
            Cropper,
            LoaderModal
        },
        data() {
            return {
                loading: false,
                upload: {
                    chosen: null,
                    src: null,
                },
                position: {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                },
                stencilProps: {
                    aspectRatio: this.config.aspectRatio
                },
                options: {
                    minWidth: this.config.minWidth
                },
                isValid: false
            }
        },
        methods: {
            callAPI(formData) {
                return new Promise(async (resolve, reject) => {
                    let xhr = new XMLHttpRequest();
                    xhr.open('POST', window.endpoint + this.config.api, true);
                    xhr.setRequestHeader("Accept-Type", "application/json");
                    xhr.setRequestHeader('Authorization', 'bearer ' + this.$cookies.get('token'));
                    xhr.onload = () => {
                        if (xhr.status !== 200) {
                            return reject({
                                code: xhr.status,
                                data: xhr.statusText
                            })
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
            close(image){
                this.$emit('close', image);
            },
            extractImage() {
                let img = new Image();
                let reader = new FileReader();
                img.onload = () => {
                    if (this.config.minWidth) {
                        if (img.width < this.config.minWidth) {
                            this.$swal("Warning", "Image width should be at least " + this.config.minWidth + "px wide.", "warning");
                            return;
                        } else if (this.config.aspectRatio && img.width / this.config.aspectRatio > img.height) {
                            this.$swal("Warning", "Image does not match the required specification.", "warning");
                            return;
                        }
                    }
                    if (this.config.maxSize && this.upload.chosen.size > 1024 * 1024 * this.config.maxSize) {
                        this.$swal("Warning", "Image exceeds the minimum size of " + this.config.maxSize + " MB", "warning");
                        return;
                    }
                    this.isValid = true;
                    reader.onload = (e) => {
                        this.upload.src = e.target.result;
                    };
                    reader.readAsDataURL(this.upload.chosen);
                };
                img.src = window.URL.createObjectURL(this.upload.chosen);
            },
            fileUploaded() {
                this.upload.chosen = this.$refs.fileUpload.files[0];
                this.isValid = false;
                this.extractImage();
            },
            onChange({coordinates, canvas}) {
                this.position = coordinates;
            },
            async uploadFull() {
                this.loading = true;
                this.data.name = this.$refs.fileUpload.files[0].name;
                let formData = new window.FormData();
                formData.append('file', this.upload.chosen);
                formData.append('document', JSON.stringify(this.data));
                try {
                    let result = await this.callAPI(formData);
                    this.loading = false;
                    this.close(JSON.parse(result));
                    this.$swal({
                        title: 'Uploaded',
                        text: 'Image has been uploaded successfully',
                        type: 'success',
                    });
                } catch (err) {
                    this.loading = false;
                    this.$swal({
                        title: "Error",
                        text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                        type: "error"
                    });
                }
            },
            async uploadCropped() {
                this.loading = true;
                this.data.name = this.$refs.fileUpload.files[0].name;
                let formData = new window.FormData();
                formData.append('file', this.upload.chosen);
                let bodyObj = {
                    ...this.data,
                    cropx: this.position.left,
                    cropy: this.position.top,
                    cropw: this.position.width,
                    croph: this.position.height
                };

                formData.append('document', JSON.stringify(bodyObj));
                try {
                    let result = await this.callAPI(formData);
                    this.loading = false;
                    this.close(JSON.parse(result));
                    this.$swal({
                        title: 'Uploaded',
                        text: 'Image has been uploaded successfully',
                        type: 'success',
                        confirmButtonColor: '#ff6500'
                    });
                } catch (err) {
                    this.loading = false;
                    this.$swal({
                        title: "Error",
                        text: err && err.data && err.data.message ? err.data.message : 'Some error occurred',
                        type: "error"
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    input[type="file"] {
        &:before {
            border-radius: 6px !important;
            padding: 0 16px;
        }
    }
</style>