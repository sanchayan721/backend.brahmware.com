const supportedFileTypes = {

    /* Image Formats */
    jpg: {
        name: 'jpg',
        extension: '.jpg',
        type: 'media/image',
        contentType: 'image/jpeg'
    },
    jpeg: {
        name: 'jpeg',
        extension: '.jpeg',
        type: 'media/image',
        contentType: 'image/jpeg'
    },
    png: {
        name: 'png',
        extension: '.png',
        type: 'media/image',
        contentType: 'image/png'
    },
    gif: {
        name: 'gif',
        extension: '.gif',
        type: 'media/image',
        contentType: 'image/gif'
    },
    bmp: {
        name: 'bmp',
        extension: '.bmp',
        type: 'media/image',
        contentType: 'image/bmp'
    },
    webp: {
        name: 'webp',
        extension: '.webp',
        type: 'media/image',
        contentType: 'image/webp'
    },
    svg: {
        name: 'svg',
        extension: '.svg',
        type: 'media/image',
        contentType: 'image/svg+xml'
    },

    /* Video Formats */
    mp4: {
        name: 'mp4',
        extension: '.mp4',
        type: 'media/video',
        contentType: 'video/mp4'
    },
    mov: {
        name: 'mov',
        extension: '.mov',
        type: 'media/video',
        contentType: 'video/quicktime'
    },
    avi: {
        name: 'avi',
        extension: '.avi',
        type: 'media/video',
        contentType: 'video/x-msvideo'
    },
    mkv: {
        name: 'mkv',
        extension: '.mkv',
        type: 'media/video',
        contentType: 'video/x-matroska'
    },
    webm: {
        name: 'webm',
        extension: '.webm',
        type: 'media/vodeo',
        contentType: 'video/webm'
    },

    /* Audio Formats */
    mp3: {
        name: 'mp3',
        extension: '.mp3',
        type: 'media/audio',
        contentType: 'audio/mpeg'
    },
    wav: {
        name: 'wav',
        extension: '.wav',
        type: 'media/audio',
        contentType: 'audio/wav'
    },
    ogg: {
        name: 'ogg',
        extension: '.ogg',
        type: 'media/audio',
        contentType: 'audio/ogg'
    },
    /* Document Formats */
    pdf: {
        name: 'pdf',
        extension: '.pdf',
        type: 'document/pdf',
        contentType: 'application/pdf'
    },
    doc: {
        name: 'doc',
        extension: '.doc',
        type: 'document/word',
        contentType: 'application/msword'
    },
    docx: {
        name: 'docx',
        extension: '.docx',
        type: 'document/word',
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    xls: {
        name: 'xls',
        extension: '.xls',
        type: 'document/excel',
        contentType: 'application/vnd.ms-excel'
    },
    xlsx: {
        name: 'xlsx',
        extension: '.xlsx',
        type: 'document/excel',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    ppt: {
        name: 'ppt',
        extension: '.ppt',
        type: 'document/powerpoint',
        contentType: 'application/vnd.ms-powerpoint'
    },
};

const emptyFileType = {
    nane: '',
    extension: '',
    type: '',
    contentType: ''
};

module.exports = { supportedFileTypes, emptyFileType };