import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./style.css"; 

const AdvCard = (props) => {

    const [ trips, setTrips] = useState([]);

    const completeTrip = (event) => {
        event.preventDefault();

        console.log("id:", event.target.id);
        document.querySelector("#yesbtn").value = event.target.id;
        document.querySelector("#savebtn").value = event.target.id;
        document.querySelector("#nobtn").value = event.target.id;

        const payload = {
            title: event.target.parentElement.parentElement.querySelector("#title").innerHTML,
            location: event.target.parentElement.parentElement.querySelector("#location").innerHTML,
            date: event.target.parentElement.parentElement.querySelector("#date").innerHTML,
            campers: event.target.parentElement.parentElement.querySelector("#campers").innerHTML,
            items: event.target.parentElement.parentElement.querySelector("#items").innerHTML
        };

        console.log("This is the info clickeddddd", payload);

        document.getElementById("exampleModalLongTitle").innerHTML = payload.title;
    };

    const showID = (event) => {
        console.log("modal1 id:", event.target.value);
    }

    const saveReview = (event) => {
        // console.log("completeBtn ID:", event.target.parentElement.parentElement.parentElement.parentElement.previousSibling.previousSibling.firstElementChild.childNodes[1].childNodes[5].childNodes[1].id);
        // var id = event.target.parentElement.parentElement.parentElement.parentElement.previousSibling.previousSibling.firstElementChild.childNodes[1].childNodes[5].childNodes[1].id;
        var id = event.target.value;
        console.log("modal2 id:", id);

        event.preventDefault();

        var review = event.target.parentElement.previousSibling.firstElementChild.querySelector("#exampleFormControlTextarea1").value;

        console.log("review", review);

        var info = {
            id: id,
            review: review
        }

        event.target.parentElement.previousSibling.firstElementChild.querySelector("#exampleFormControlTextarea1").value = "";

        //Update to True
        axios({
            url: `/api/update/${id}`,
            method: 'PUT',
            data: info
        })
        .then(() => {
            console.log('Data has been sent to the server!');
            this.resetUserInputs();
        })
        .catch((err) => {
            console.log('Internal server error :(', err);
        });

        window.location.reload();
    }

    const saveReview2 = (event) => {
        // console.log("completeBtn ID:", event.target.parentElement.parentElement.parentElement.parentElement.previousSibling.previousSibling.firstElementChild.childNodes[1].childNodes[5].childNodes[1].id);
        // var id = event.target.parentElement.parentElement.parentElement.parentElement.previousSibling.previousSibling.firstElementChild.childNodes[1].childNodes[5].childNodes[1].id;
        var id = event.target.value;
        console.log("modal2 id:", id);

        event.preventDefault();

        var info = {
            id: id,
            review: ""
        }

        //Update to True
        axios({
            url: `/api/update/${id}`,
            method: 'PUT',
            data: info
        })
        .then(() => {
            console.log('Data has been sent to the server!');
            this.resetUserInputs();
        })
        .catch((err) => {
            console.log('Internal server error :(', err);
        });

        window.location.reload();
    }

    const deleteCard = (event) => {
        var id = event.target.id;
        console.log("delete id:", event.target.id);

        event.preventDefault();

        axios({
            url: `/api/delete/${id}`,
            method: 'DELETE',
            data: id
        })
        .then(() => {
            console.log('Data has been deleted!');
            this.resetUserInputs();
        })
        .catch((err) => {
            console.log('Internal server error :(', err);
        });

        window.location.reload();
    }

    const updateTrip = (event) => {
        var id = event.target.id;
        console.log("update id:", event.target.id);

        event.preventDefault();

        window.location.reload();
    }

    useEffect(()=>{
      console.log("Current works!");
      fetch("/api/all")
      .then(data=> data.json())
      .then(data => setTrips(data))
    },[])

    return (
        <>
            {trips.map((each, index)=>{
                return (
                    <>
                    <div className="col mb-4">
                        <div className="card h-100">
                            <img
                                src="https://imagesvc.meredithcorp.io/v3/mm/image?q=85&c=sc&poi=face&w=1600&h=1067&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F28%2F2020%2F01%2Fglacier-national-park-GLACIERSIGNS0120.jpg"
                                className="card-img-top"
                                alt="..."
                            />
                            <div className="card-body">
                                <h5 id="title" style={{fontWeight: "600", marginBottom: "5%"}} className="card-title">{each.title}</h5>
                                <p style={{ textAlign: "left", marginLeft: "5%" }} className="card-text"><span style={{fontWeight: "700"}}>Dates: </span><span id="date">{each.date}</span></p>
                                <p style={{ textAlign: "left", marginLeft: "5%" }} className="card-text"><span style={{fontWeight: "700"}}>Location: </span><span id="location">{each.location}</span></p>
                                <p style={{ textAlign: "left", marginLeft: "5%" }} className="card-text"><span style={{fontWeight: "700"}}>Campers: </span><span id="campers">{each.campers}</span></p>
                                <p style={{ textAlign: "left", marginLeft: "5%" }} className="card-text"><span style={{fontWeight: "700"}}>Backpack: </span><span id="items">{each.items}</span></p>
                                <div class="btn-group" role="group" aria-label="Basic example">
                                    <button id={each._id} type="button" class="btn btn-warning" onClick={updateTrip}>Update</button>
                                    <button id={each._id} type="button" className="complete-trip-btn btn btn-outline-success" data-toggle="modal" data-target="#exampleModalid" onClick={completeTrip}>
                                        Complete Trip
                                    </button>
                                    <button id={each._id} type="button" class="btn btn-danger" onClick={deleteCard}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*//Prompt for review*/}
                    <div className="modal fade" id="exampleModalid" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div id="modal-content" className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Review Trip?</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Would you like to write a review for your trip?
                        </div>
                        <div className="modal-footer">
                            <button id="nobtn" type="button" className="btn btn-secondary no-btn" data-id="id" data-dismiss="modal" onClick={saveReview2}>No</button>
                            <button id="yesbtn" type="button" className="btn btn-primary writeTxtBtn" data-id="id" data-toggle="modal" data-target="#exampleModalCenterid" data-dismiss="modal" onClick={showID}>
                                Yes
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                    {/*//Prompt for review*/}


                    {/*<!-- Review Modal -->*/}
                    <div className="modal fade" id="exampleModalCenterid" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div id="modal-content" className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLongTitle"></h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label for="exampleFormControlTextarea1">Write your review:</label>
                                        <textarea className="form-control review-textid" id="exampleFormControlTextarea1" rows="3" maxlength="250"></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button id="savebtn" type="button" className="btn btn-primary save-review" data-dismiss="modal" data-id="id" onClick={saveReview}>Save changes</button>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/*<!-- Review Modal -->*/}
                    
                    </>
                )
            })}
        </>
    )
}

export default AdvCard;