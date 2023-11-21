import React, {Component} from 'react';
import {Upload, message, Button} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import request from '@/utils/request';
import { getUrl } from '@/utils/RequestUrl';

class SearchData extends Component {
    // beforeUpload 返回 false 后，手动上传文件。
    beforeUpload = () => {
        return false;
    }
// 查询车辆信息列表
    
     submitForm = () => {
        const {file} = this.state;
         const formData = new FormData();
    
         formData.append("deviceNum", this.state.deviceNum);
        
         formData.append("file", file);
        const a = getUrl(`/operationApi/file/upload`)
         request(a, {
            data: formData,
            method: 'POST',
          });}
    

    //获取已经上传文件的列表
    uploadChange = (info) => {
        const {file} = this.state
        this.setState({file: info.file})
        return false;
    }

    //点击确定按钮
    uploadConfirm = () => {
        const {file} = this.state
        if (file) {
           this.submitForm();
        } else {
            message.info('请上传文件')
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            deviceNum: '', //集卡号
        };
    }

    deviceChange = (e) => {
        this.setState({ deviceNum: e.target.value }, () => console.log(this.state.deviceNum));
    };
    render() {
        const props = {
            multiple: false,
            accept: '.zip,.xls,.xlsx',
            action: null,
            onChange: this.uploadChange,
            beforeUpload: this.beforeUpload,
            showUploadList: false
        };
        return (
            <div>
                <input type="text" placeholder="请输入集卡号" value={this.state.deviceNum} onChange={(e) => this.deviceChange(e)} />
                <h3>上传文件</h3>
                <Upload {...props}>
                    <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                </Upload>
                <button onClick={this.uploadConfirm}>确定</button>
            </div>
        );
    }
}

export default SearchData;
