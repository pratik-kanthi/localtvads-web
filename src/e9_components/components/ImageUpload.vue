<template>
    <div class="bg-white">
        <v-dialog class="bg-white" v-model="show" width="500" persistent data-app>
            <div class="modal-header">
                <h3>Upload Picture</h3>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-5">
                        <h3 class="section-title mt0 mb24">Choose File</h3>
                        <input type="file" @change="fileUploaded" accept="image/*" ref="fileUpload"/>
                    </div>
                </div>
                <div v-if="upload.src">
                    <h3 class="section-title">2. Crop Image</h3>
                    <img :src="upload.src" alt="Uploaded Image">
                </div>
                <div v-if="upload.src" class="mt8">
                    <h3 class="section-title">3. Confirm</h3>
                    <button class="btn btn-sm btn-primary btn-filled mr10" :disabled="loading" v-show="!upload.dimensions"
                            @click="uploadFull">
                        <i class="material-icons">crop_free</i> Upload Uncropped
                    </button>
                    <button class="btn btn-sm btn-primary btn-filled mr10" :disabled="loading" v-show="upload.dimensions"
                            @click="uploadCropped">
                        <i class="material-icons">crop</i> Upload Cropped
                    </button>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary">Crop and Upload</button>
            </div>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "ImageUpload",
        props: ['show', 'config'],
        data() {
            return {
                loading: false,
                upload: {
                    chosen: null,
                    src: null,
                    dimensions: null,
                    allowRect: true,
                    aspectRatio: this.config.aspectratio,
                    minWidth: this.config.minWidth,
                }
            }
        },
        methods: {
            uploadFull() {
                this.loading = true;
                this.loading = false;
            },
            uploadCropped() {
                this.loading = true;
                this.loading = false;
            },
            fileUploaded() {
                this.upload.chosen = this.$refs.fileUpload.files[0];
                this.extractImage();
            },
            extractImage() {
                let img = new Image();
                let reader = new FileReader();
                img.onload = () => {
                    if (this.upload.minWidth) {
                        if (img.width < this.upload.minWidth) {
                            this.$swal("Warning", "Image width should be at least " + this.upload.minWidth + "px wide.", "warning");
                            return;
                        }
                        else if (this.upload.aspectRatio && img.width / this.upload.aspectRatio > img.height) {
                            this.$swal("Warning", "Image does not match the required specification.", "warning");
                            return;
                        }

                        if (this.config && this.upload.chosen.size > 1024 * 1024 * this.config.maxSize) {
                            this.$swal("Warning", "Image exceeds the minimum size of " + this.config.maxSize + " MB", "warning");
                            return;
                        }
                    }
                    reader.onload = (e) => {
                        this.upload.src = e.target.result;
                    };
                    reader.readAsDataURL(this.upload.chosen);
                };
                img.src = window.URL.createObjectURL(this.upload.chosen);
            }
        }
    }
</script>

<style lang="less" scoped>
    input[type="file"] {
        &:before {
            border-radius: 6px !important;
            padding: 0 16px;
        }
    }
</style>