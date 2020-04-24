export const uploadMixin = {
    data() {
        return {
            config: {
                maxSize: 250,
                allowedExtensions: ['mp4', 'webm', 'avi', 'mpv', 'mpg', 'flv']
            },
            isValid: false,
            upload: {
                chosen: null
            },
            socket: null,
            videoUrl: '',
            progress: 0,
            isLoading: false
        };
    },
    methods: {
        fileUploaded() {
            this.isValid = false;
            this.upload.chosen = this.$refs.fileUpload.files[0];
            window.URL = window.URL || window.webkitURL;
            let duration,
                video = document.createElement('video');
            video.preload = 'auto';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                duration = video.duration;
                if (this.$parent.clientAdPlan && duration > this.$parent.clientAdPlan.ChannelPlan.Plan.Seconds) {
                    this.$swal('Warning', 'Video duration exceeds ' + this.$parent.clientAdPlan.ChannelPlan.Plan.Seconds + ' seconds. Please keep it within allowed duration', 'warning');
                    this.upload.chosen = null;
                    return;
                }
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
                client: data.Client,
                clientAdPlan: data._id,
                clientServiceAddOn: data._id,
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
        }
    }
};
