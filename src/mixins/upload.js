export const uploadMixin = {
    data() {
        return {
            config: {
                maxSize: 250,
                allowedExtensions: ['mp4', 'webm', 'avi', 'mpv', 'mpg', 'flv', 'mov']
            },
            isValid: false,
            upload: {
                chosen: null
            },
            socket: null,
            videoUrl: '',
            progress: 0,
            isLoading: false,

        };
    },
    methods: {
        fileUploaded() {
            this.isValid = false;
            this.upload.chosen = this.$refs.fileUpload.files[0];
            window.URL = window.URL || window.webkitURL;
            let video = document.createElement('video');
            video.preload = 'auto';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);

                if (this.config.maxSize && this.upload.chosen.size > 1024 * 1024 * this.config.maxSize) {
                    this.$swal('Warning', 'File exceeds the minimum size of ' + this.config.maxSize + ' MB', 'warning');
                    this.upload.chosen = null;
                    return;
                }
                if (this.config.allowedExtensions && this.config.allowedExtensions.indexOf(this.upload.chosen.name.substr(this.upload.chosen.name.lastIndexOf('.') + 1)) === -1) {
                    this.$swal('Warning', 'We accept only following file types : ' + this.config.allowedExtensions.join(', '), 'warning');
                    this.upload.chosen = null;
                    return;
                }
                this.isValid = true;
                this.videoUrl = video.src;
            };
            video.src = URL.createObjectURL(this.upload.chosen);
            this.videoUrl = video.src;
        },
        cancelUpload() {
            this.upload.chosen = null;
            this.$store.commit('VIDEO_BEING_UPLOADED', false);
        },
        chooseFile() {
            $('#fileUpload').click();
        },
        sendSocket(chunk, counter, chunkSize, data, eventName) {
            this.socket.emit(eventName, {
                data: chunk,
                sequence: counter,
                isLast: chunk.size < chunkSize,
                client: data,
                name: this.upload.chosen.name
            });
        },
        uploadVideo() {
            this.$swal({
                title: 'Are you sure?',
                text: 'Video will be uploaded and submitted for review.',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                closeOnConfirm: false
            }).then(isConfirm => {
                if (isConfirm.value) {
                    this.uploadFile();
                }
            });
        },
        async uploadFile() {
            this.$store.commit('VIDEO_BEING_UPLOADED', true);
            let counter = 1;
            let chunkSize = 100000;
            this.socket = this.io(window.socketendpoint, {
                query: {
                    token: this.$cookies.get('token')
                }
            });
            let start = 0;
            let chunk = this.upload.chosen.slice(start, chunkSize);

            this.sendSocket(chunk, counter, chunkSize, this.$store.getters.getUser.Owner._id, 'UPLOAD_CHUNK');
            this.socket.on('UPLOAD_CHUNK_FINISHED', data => {
                this.progress = (((data * 100000) / this.upload.chosen.size) * 100).toFixed(0);
                ++counter;
                start = start + chunkSize;
                if (start - chunkSize < this.upload.chosen.size) {
                    chunk = this.upload.chosen.slice(start, start + chunkSize);
                    this.sendSocket(chunk, counter, chunkSize, this.$store.getters.getUser.Owner._id, 'UPLOAD_CHUNK');
                }
            });

            this.socket.on('UPLOAD_FINISHED', () => {
                this.progress = 100;
                this.processing = true;
            });

            this.socket.on('UPLOAD_ERROR', () => {
                this.$swal({
                    title: 'Error',
                    text: 'There was an error while uploading the video',
                    type: 'error'
                });
                this.socket.disconnect();
                this.isLoading = false;
                this.$store.commit('VIDEO_BEING_UPLOADED', false);
            });

            this.socket.on('PROCESS_FINISHED', (data) => {
                setTimeout(() => {
                    this.$swal({
                        title: 'Uploaded',
                        text: 'Ad has been uploaded successfully',
                        type: 'success',
                        confirmButtonColor: '#ff6500'
                    });
                    this.progress = 0;
                    this.processing = false;
                    this.$store.commit('VIDEO_BEING_UPLOADED', false);
                    this.socket.disconnect();
                    this.closeUpload(data);

                }, 1000);
            });

            this.socket.on('PROCESS_ERROR', () => {
                this.$swal({
                    title: 'Error',
                    text: 'There was an error while uploading the video',
                    type: 'error'
                });
                this.socket.disconnect();
                this.isLoading = false;
            });
        }
    }
};