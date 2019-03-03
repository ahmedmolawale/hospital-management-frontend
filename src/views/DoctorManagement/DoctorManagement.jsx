import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalTitle,
  ModalHeader,
  FormControl
} from "react-bootstrap";
import { connect } from "react-redux";
import { CardWithButton } from "components/CardWithButton/CardWithButton.jsx";
import Button from 'elements/CustomButton/CustomButton.jsx';
import {
  fetchAllDoctors,
  createDoctor
} from "./action.js";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import matchSorter from 'match-sorter'
import alertify from 'alertifyjs';

const Loading = require("react-loading-animation");
const currencyFormatter = require("currency-formatter");

class DoctorManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
   
      selectedInstitutionAdmin:null,
      errorMessage: "",
      showModal: false,
      filtered: [],
      filterAll: '',
      doctors:[],
      isLoadingDoctors: false,
      isLoadingCreateDoctor: false,
      first_name: '',
      last_name: '',
      dob:'',
      occupation:'',
      phone_number:'',
      gender: '',
      mdcn:'',
      address:'',
      email_address: '',
      nationality:'',
      state_of_origin:'',
      next_of_kin_address:'',
      next_of_kin_name:'',
      next_of_kin_occupation:'',
      next_of_kin_phone_number:'',
      next_of_kin_relationship: '',
      isLoadingCreateNurse: false

  };
  this.filterAll = this.filterAll.bind(this);
     this.patients = [];
  }
  componentWillMount() {
    //dispatch an action to retrieve clients
    this.fetchAllDoctors();
  }
  fetchAllDoctors(){
    this.props
      .fetchAllDoctors()
      .then(response => {
        console.log('Response is', response);
        const {
          payload:{status, data}
        } = response;
        
        if (status === 200) {
          this.setState({isLoadingDoctors: false, doctors: data})
        }else{
          this.setState({
            isLoadingDoctors: false,
            doctors: null,
            errorMessage: "An error occurred fetching nurses."
          });
        }
      }).catch(() => {
        this.setState({
          isLoadingDoctors: false,
          doctors: null,
          errorMessage: "An error occurred."
        });
      });
  }

handleAssignPatient(patient){
 console.log('Patient info is ', patient)
 this.setState({selectedPatient: patient});
 this.showAvailableNurses()
 //this.showConfirmDialog('Confirmation', 'Are you sure you want to assign to nurse ?')
}
open(){
  this.setState({showModal: true, gender: 'male'})
}
close(){
  this.setState({showModal: false})
}
open2(){
  this.setState({showModal2: true})
}
close2(){
  this.setState({showModal2: false})
}
showAlert(title, message) {
  alertify.alert(title, message, function () {
  });
}
columnGeneratorDoctor(){
  return [
        {
            Header: 'S/N',
            accessor: 'sn',
        },
        {
            Header: 'Doctor Id',
            accessor: 'id',
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Gender',
            accessor: 'gender',
        },
        {
            Header: 'MCDN',
            accessor: 'mdcn',
        },
        {
          Header: 'Phone Number',
          accessor: 'phone_number',
      },
        {
            Header: 'Date of birth',
            accessor: 'dob',
        },
        {
          Header: 'Registered on',
          accessor: 'created_at',
      },
        {
            Header: "",
            id: 'all',
            width: 0,
            resizable: false,
            sortable: false,
            Filter: () => { },
            filterMethod: (filter, rows) => {
              const result = matchSorter(rows, filter.value, {
                keys: [
                  "sn",
                  "name",
                  "id",
                  "gender",
                  "phone_number",
                  "mcdn",
                  "dob",
                  "createdAt"
                ], threshold: matchSorter.rankings.CONTAINS
              });
              return result;
            },
            filterAll: true,
          }
    ] 
}
handleAssignNurse(nurse){

}
generateDoctorData(doctors) {
  return doctors.map((doctor, index) => {
      const { staff_id, first_name, last_name, dob, nationality, state_of_origin, phone_number, gender, address,mdcn, createdAt} = doctor;
      const date = new Date(createdAt)
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var yyyy = date.getFullYear();
      
      return ({
          sn: ++index,
          state_of_origin,
          mdcn,
          dob,
          phone_number,
          gender,
          address,
          name: `${first_name} ${last_name}`,
          created_at: `${dd}/${mm}/${yyyy}`,
          id: staff_id,
      })
  })
}
onFilteredChange(filtered) {
  if (filtered.length > 1 && this.state.filterAll.length) {
    const filterAll = '';
    this.setState({ filtered: filtered.filter((item) => item.id !== 'all'), filterAll })
  }
  else
    this.setState({ filtered });
}
filterAll(e) {
  const { value } = e.target;
  const filterAll = value;
  const filtered = [{ id: 'all', value: filterAll }];
  this.setState({ filterAll, filtered });
}
onSubmit(e){
  e.preventDefault();
  const {first_name, last_name, dob,email_address, gender, phone_number, address, mdcn, nationality, state_of_origin,
  next_of_kin_address, next_of_kin_occupation, next_of_kin_phone_number, next_of_kin_name, next_of_kin_relationship}
   = this.state;
  let requestBody = {
    first_name,
    last_name,
    dob,
    gender,
    phone_number,
    address,
    mdcn,
    email_address,
    nationality,
    state_of_origin,
    next_of_kin_address,
    next_of_kin_name,
    next_of_kin_occupation,
    next_of_kin_phone_number,
    next_of_kin_relationship
  };
  console.log('Doctor ', requestBody)
  this.setState({isLoadingCreateDoctor: true});
      this.props.createDoctor(requestBody)
      .then(res => {
        console.log('Response is', res)
        this.setState({isLoadingCreateDoctor: false});
        if(res.payload.status === 201){
          this.setState({isLoadingCreateDoctor: false, doctors: null, staffId: res.payload.data.staff_id});
          this.showAlert('Success', `Doctor has been created successfully.\n Staff Id is ${this.state.staffId}.
           Staff login credentials has been sent to their email address.`)
          this.fetchAllDoctors();
        }else if(res.payload.response.status === 400){
          this.setState({isLoadingCreateDoctor: false});
          this.showAlert('Error', 'An error occurred.')
        }
      }).catch(err => {
        this.setState({isLoadingCreateDoctor: false});
        this.showAlert('Error', 'An error occurred.')
      })
  
}

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            {
              <Col md={12}>
                <CardWithButton
                  title="Doctors"
                  category="All the doctors on the platform"
                  ctTableFullWidth
                  ctTableResponsive
                  showButton={true}
                  onButtonClick={() => this.open()}
                  buttonName="Add New Doctor"
                  content={
                    !this.state.doctors ? (
                      <Loading isLoading={this.state.isLoadingDoctors} />
                    ) : (
                      <div className='data-table-div'><br/>
                                Search: <input value={this.state.filterAll} onChange={this.filterAll} /><br/><br/>
                      <ReactTable
                      className={'center-align'}
                      data={this.generateDoctorData(this.state.doctors)}
                      columns={this.columnGeneratorDoctor()}
                      filtered = {this.state.filtered}
                      onFilteredChange={this.onFilteredChange.bind(this)}
                      defaultPageSize={5}
                      getTheadProps={(state, rowInfo, column) => {
                                        return {
                                            style: {
                                                background: "#FFF",
                                                color: "black",
                                               
                                            }
                                        };
                    }}/>
                        </div>
                    )
                  }
                />
              </Col>
            }
          </Row>
        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <ModalHeader closeButton>
            <ModalTitle>
              <strong>Setup Doctor</strong>
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
          <Loading isLoading={this.state.isLoadingCreateDoctor} />
            <div>
            <h5 className={"centre-message"}>{this.state.message}</h5>
            <h5 className="error-message">{this.state.errorMessage}</h5>
            <form onSubmit={this.onSubmit.bind(this)}>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>First Name< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'First Name'
                onChange = {(e) => {this.setState({first_name: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Last Name< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Last name'
                onChange = {(e) => {this.setState({last_name: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            <Row>
            <Col md = {4}>
              <div className = {`form-group in-line`} >
              <label>Date of Birth< strong className = 'error-message'> *</strong></label >
              <input required type={'date'}
                onChange = {(e) => {this.setState({dob: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md ={3}>
            <div>
            <label>Gender <strong className = 'error-message' > * </strong></label>
              <FormControl
                    componentClass="select"
                    placeholder="select"
                    onChange={(e) => this.setState({gender: e.target.value})}
                  >
                  <option value={'male'} key={0}>Male</option>
                  <option value={'female'} key={1}>Female</option>
                  </FormControl>

             </div></Col>
            <Col md = {5}>
              <div className = {`form-group in-line`} >
              <label>Phone number< strong className = 'error-message'> *</strong></label >
              <input required type={'number'}  maxLength ={11} minLength={11} placeholder = '07011223344'
                onChange = {(e) => {this.setState({phone_number: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Address< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Address'
                onChange = {(e) => {this.setState({address: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>MDCN< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'mdcn'
                onChange = {(e) => {this.setState({mdcn: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            <Row>
            <Col md = {4}>
              <div className = {`form-group in-line`} >
              <label>Email Address< strong className = 'error-message'> *</strong></label >
              <input required type={'email'} placeholder = 'abc@xyz.com'
                onChange = {(e) => {this.setState({email_address: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {4}>
              <div className = {`form-group in-line`} >
              <label>Nationality< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Nigeria'
                onChange = {(e) => {this.setState({nationality: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {4}>
              <div className = {`form-group in-line`} >
              <label>State of origin< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Osun'
                onChange = {(e) => {this.setState({state_of_origin: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
            <Row>
            
              <h5 className='margin-left'>Next of Kin Information</h5>
              <hr/>
              
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Name< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Olanshile'
                onChange = {(e) => {this.setState({next_of_kin_name: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
            <div className = {`form-group in-line`} >
            <label>Phone number< strong className = 'error-message'> *</strong></label >
            <input required type={'number'}  maxLength ={11} minLength={11} placeholder = 'Phone number'
              onChange = {(e) => {this.setState({next_of_kin_phone_number: e.target.value})}} className = "form-control"/>
            </div> 
          </Col>
            </Row>
            <Row>
            <Col md = {6}>
              <div className = {`form-group in-line`} >
              <label>Relationship< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Relationship'
                onChange = {(e) => {this.setState({next_of_kin_relationship: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            <Col md = {6}>
            <div className = {`form-group in-line`} >
            <label>Occupation< strong className = 'error-message'> *</strong></label >
            <input required placeholder = 'Occupation'
              onChange = {(e) => {this.setState({next_of_kin_occupation: e.target.value})}} className = "form-control"/>
            </div> 
          </Col>
            </Row>
            <Row>
            <Col md = {12}>
              <div className = {`form-group in-line`} >
              <label>Address< strong className = 'error-message'> *</strong></label >
              <input required placeholder = 'Next of kin address'
                onChange = {(e) => {this.setState({next_of_kin_address: e.target.value})}} className = "form-control"/>
              </div> 
            </Col>
            </Row>
              <Button bsStyle="info" fill type="submit" block>
                Create Doctor
              </Button>
              <br/>
            </form>
            </div>
          </ModalBody>
          <Modal.Footer>
            <Button bsStyle="danger" fill onClick={this.close.bind(this)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        </Grid>
        <div />
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   return {
//     token: state.adminToken.data.access_token
//   };
// }

export default connect(null, {
fetchAllDoctors,
createDoctor,
})(DoctorManagement);
