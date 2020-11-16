import React from "react";
import tripIcon from "../../img/trips-icon.png";
import reviewIcon from "../../img/review-icon.png";
import badgeIcon from "../../img/badge-icon.png";
import placeHolder from "../../img/placeholder.heic";
import arrowIcon from "../../img/arrowIcon.png";
import "../MainProfile/style.css";
import classNames from 'classnames';
import ProfilePicture from './ProfilePicture';

// document.querySelector('.upload-profile-btn').addEventListener('click', function(event) {
//     event.preventDefault();
//     let profilePic = document.getElementById('add-image-input').value;
//     console.log(profilePic);
// })


//let profileSrc;

const SideBar = (props) => {
    console.log(props.user);
    console.log(props.user.img);

    function displayTrips() {
        props.onSelectionChange("Trips")
    }

    function displayReviews() {
        props.onSelectionChange("Reviews")
    }

    function displayMilestones() {
        props.onSelectionChange("Milestones")
    }

    // if(props.user.img) {
    //     profileSrc = props.user.img;
    // } else {
    //     profileSrc = placeHolder;
    // }

    return <>
        <section>
            <div className="sideBarStyle">
                {/* <div className="img-upload">
                <label className="add-image-label">
                <input id="add-image-input" type="file" onChange={this.fileSelectedHandler} className="add-image" />
                <img src={placeHolder} className="profilePicStyle" alt="profile" />
                </label>
                <button type="submit" className="upload-profile-btn">+</button>
                </div> */}
                <ProfilePicture />

                <ul>
                    <li className={classNames('sideBarMenuItem', props.userSelection === "Trips" ? 'tripActive' : 'tripsStyle')} onClick={displayTrips.bind(this)}>
                        <h5 className="optionsTextAlign">
                            <img src={tripIcon} className="iconStyle" alt="cannot display" />
                            Trips
                            <img src={arrowIcon} className="arrowIconStyle" alt="profile" />
                        </h5>
                    </li>
                    <li className={classNames('sideBarMenuItem', props.userSelection === "Reviews" ? 'revewActive' : 'reviewStyle')} onClick={displayReviews.bind(this)}>
                        <h5 className="optionsTextAlign">
                            <img src={reviewIcon} className="iconStyle" alt="cannot display" />
                            Reviews
                            <img src={arrowIcon} className="arrowIconStyle" alt="profile" />
                        </h5>
                    </li>
                    <li className={classNames('sideBarMenuItem', props.userSelection === "Milestones" ? 'milestoneActive' : 'mileStoneStyle')} onClick={displayMilestones.bind(this)}>
                        <h5 className="optionsTextAlign">
                            <img src={badgeIcon} className="iconStyle" alt="cannot display" />
                            Milestones
                            <img src={arrowIcon} className="arrowIconStyle" alt="profile" />
                        </h5>
                    </li>
                </ul>
            </div>
        </section>
    </>;
}

export default SideBar;