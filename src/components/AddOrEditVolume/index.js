import React, { PureComponent } from 'react';
import { Form, Input, Modal, Radio, Tooltip, Drawer, Button, Row, Col, Upload, message } from 'antd';
import apiconfig from '../../config/config';
import cookie from "../../utils/cookie";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@Form.create()
export default class AddVolumes extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      configurationShow: false,
      configuration_content: ''
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit && this.props.onSubmit(values);
      }
    });
  };
  handleCancel = () => {
    this.props.onCancel && this.props.onCancel();
  };
  handleChange = (e) => {
    if (e.target.value == 'config-file') {
      this.setState({
        configurationShow: true
      })
    } else {
      this.setState({
        configurationShow: false
      })
    }
  }
  //验证上传文件方式
  checkFile = (rules, value, callback) => {
    if (value) {
      if (value.fileList.length > 0 && (value.file.name.endsWith(".txt") || value.file.name.endsWith(".json") || value.file.name.endsWith(".yaml") || value.file.name.endsWith(".yml") || value.file.name.endsWith(".xml"))) {
        const fileList = value.fileList.splice(-1)
        this.readFileContents(fileList, 'file_content');
        callback();
        return;
      } else {
        // callback('请上传文件');
        return;
      }
    }
    callback()
  }
  beforeUpload = (file) => {
    // console.log(file)
    const fileArr = file.name.split(".");
    const length = fileArr.length;
    let isRightType = fileArr[length - 1] == "txt" || fileArr[length - 1] == "json" || fileArr[length - 1] == "yaml" || fileArr[length - 1] == "yml" || fileArr[length - 1] == "xml";
    if (!isRightType) {
      message.error('请上传以.txt, .json, .yaml, .yaml, .xml结尾的文件', 5);
      return false
    } else {
      return true
    }
  }
  readFileContents = (fileList, name) => {
    const _th = this;
    let fileString = "";
    for (var i = 0; i < fileList.length; i++) {
      var reader = new FileReader(); //新建一个FileReader
      reader.readAsText(fileList[i].originFileObj, "UTF-8"); //读取文件
      reader.onload = function ss(evt) { //读取完文件之后会回来这里
        fileString += evt.target.result;// 读取文件内容
        _th.props.form.setFieldsValue({ [name]: fileString })
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, appBaseInfo } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    let token = cookie.get('token');
    return (
      <Drawer
        title="添加存储"
        placement="right"
        width={500}
        closable={false}
        onClose={this.handleCancel}
        visible={true}
        maskClosable={true}
        closable={true}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator("volume_name", {
              initialValue: data.volume_name || "",
              rules: [
                {
                  required: true,
                  message: "请输入存储名称",
                },
              ],
            })(<Input placeholder="请输入存储名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="挂载路径">
            {getFieldDecorator("volume_path", {
              initialValue: data.volume_path || "",
              rules: [
                {
                  required: true,
                  message: "请输入挂载路径",
                },
              ],
            })(<Input placeholder="请输入挂载路径" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="类型">
            {getFieldDecorator("volume_type", {
              initialValue: data.volume_type || "share-file",
              rules: [
                {
                  required: true,
                  message: "请选择存储类型",
                },
              ],
            })(<RadioGroup onChange={this.handleChange}>
              <Radio value="share-file">
                <Tooltip title="分布式文件存储，可租户内共享挂载，适用于所有类型应用">
                  共享存储（文件）
                </Tooltip>
              </Radio>
              <Radio value="memoryfs">
                <Tooltip title="基于内存的存储设备，容量由内存量限制。应用重启数据即丢失，适用于高速暂存数据">
                  内存文件存储
                </Tooltip>
              </Radio>
              {appBaseInfo && appBaseInfo.extend_method == "state" && (<Radio value="local">
                <Tooltip title="本地高速块存储设备，适用于有状态数据库服务">本地存储</Tooltip>
              </Radio>)}
              <Radio value="config-file">
                <Tooltip title="编辑或上传您的配置文件内容">配置文件</Tooltip>
              </Radio>
            </RadioGroup>)}
          </FormItem>
          {this.state.configurationShow ? <FormItem {...formItemLayout} label="文件内容" style={{ textAlign: "right" }}>
            {getFieldDecorator('file_content', {
              rules: [{ required: true, message: '请编辑内容!' }]
            })(
              <TextArea rows={8} style={{ backgroundColor: "#02213f", color: "#fff" }} />
            )}
          </FormItem> : ''}
          {this.state.configurationShow ? <Row>
            <Col
              style={{ marginTop: "-7%" }}
              span={4} offset={4}>
              <FormItem

              >
                {getFieldDecorator('configuration_check', {
                  rules: [{ validator: this.checkFile }],
                })(
                  <Upload
                    action={`${apiconfig.baseUrl}/console/enterprise/team/certificate`}
                    showUploadList={false}
                    withCredentials={true}
                    headers={{ Authorization: `GRJWT ${token}` }}
                    beforeUpload={this.beforeUpload}
                  >
                    <Button size="small">
                      上传
                    </Button>
                  </Upload>
                )}
              </FormItem>
            </Col>
          </Row> : ''}
        </Form>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button
            style={{
              marginRight: 8,
            }}
            onClick={this.handleCancel}
          >
            取消
          </Button>
          <Button onClick={this.handleSubmit} type="primary">确认</Button>
        </div>
      </Drawer>
    )
  }
}