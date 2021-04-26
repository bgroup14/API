using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using DATA;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebApi.DTO;


using System.Text;
using System.IO;

namespace WebApi.Controllers
{
    [RoutePrefix("api/member")]
    public class MemberController : ApiController
    {
        // GET api/<controller>
        public string Get()
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            Member member = db.Members.SingleOrDefault(x => x.fullName == "alan skverer");
            MemberDTO memberDTO = new MemberDTO();
            memberDTO.name = "My email address is: " + member.email;
            return memberDTO.name;
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value test github";
        }
        [HttpPost]
        [Route("login")]
        public HttpResponseMessage Login(MemberLoginDTO memberLogin)
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {
                Member member = db.Members.SingleOrDefault(x => x.email == memberLogin.email);
                if (member == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "User dosent exists");
                }
                else
                {
                    if (member.password != memberLogin.password)
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "Incorrect password");
                    }
                }


                MemberDTO memberDTO = new MemberDTO()
                {
                    id = member.id,
                    name = member.fullName

                };
                var AuthorizedMemberDetails = db.FeedSettings.Where(x => x.memberId == member.id).Select(x => new AuthorizedMemberDetailsDTO
                {

                    id = member.id,
                    name = member.fullName,
                    helpType = x.memberType,
                    participantAge = x.participantAgeRange,
                    participantGender = x.participantGender,
                    meetingLocation = x.postLocation,
                    pictureUrl = member.pictureUrl

                });

                return Request.CreateResponse(HttpStatusCode.OK, AuthorizedMemberDetails);

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "General error");
            }

        }



        [HttpPost]
        [Route("checkifmemberexists")]


        public HttpResponseMessage CheckIfMemberExists(MemberLoginDTO memberLogin)
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {
                Member member = db.Members.SingleOrDefault(x => x.email == memberLogin.email);
                if (member != null)
                {


                    var AuthorizedMemberDetails = db.FeedSettings.Where(x => x.memberId == member.id).Select(x => new AuthorizedMemberDetailsDTO
                    {

                        id = member.id,
                        name = member.fullName,
                        helpType = x.memberType,
                        participantAge = x.participantAgeRange,
                        participantGender = x.participantGender,
                        meetingLocation = x.postLocation,
                        pictureUrl = member.pictureUrl


                    });


                    return Request.CreateResponse(HttpStatusCode.OK, AuthorizedMemberDetails);
                }



                return Request.CreateResponse(HttpStatusCode.BadRequest, "User dosent exists");

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "General error");
            }

        }




        [HttpPost]
        [Route("register")]
        public HttpResponseMessage Register(MemberSignupDTO memberSignupDTO)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
                Member member = new Member();
                member.email = memberSignupDTO.email;
                member.city = memberSignupDTO.city;
                member.password = memberSignupDTO.password;
                member.fullName = memberSignupDTO.fullName;
                member.pictureUrl = memberSignupDTO.pictureUrl;
                member.occupation = memberSignupDTO.occupation;
                member.gender = memberSignupDTO.gender;
                member.biography = memberSignupDTO.bio;
                member.dateOfBirth = memberSignupDTO.dateOfBirth;
                member.lastLocationLat = 0;
                member.lastLocationLong = 0;


                db.Members.Add(member);
                db.SaveChanges();
                FeedSetting feedSetting = new FeedSetting
                {
                    memberId = member.id,
                    memberType = memberSignupDTO.feedSettings.memberType,
                    participantAgeRange = memberSignupDTO.feedSettings.participantAgeRange,
                    participantGender = memberSignupDTO.feedSettings.participantGender,
                    postLocation = memberSignupDTO.feedSettings.postLocation
                };
                db.FeedSettings.Add(feedSetting);

                foreach (HobbiesDTO hobby in memberSignupDTO.hobbies)
                {

                    MembersHobby hobbies = new MembersHobby();
                    hobbies.hobbyId = hobby.id;
                    hobbies.memberId = member.id;
                    db.MembersHobbies.Add(hobbies);

                }


                db.SaveChanges();

                AuthorizedMemberDetailsDTO authorizedMemberDetailsDTO = new AuthorizedMemberDetailsDTO()
                {
                    id = member.id,
                    name = member.fullName,
                    participantAge = memberSignupDTO.feedSettings.participantAgeRange,
                    participantGender = memberSignupDTO.feedSettings.participantGender,
                    helpType = memberSignupDTO.feedSettings.memberType,
                    meetingLocation = memberSignupDTO.feedSettings.postLocation,
                    pictureUrl = member.pictureUrl
                };

                return Request.CreateResponse(HttpStatusCode.OK, authorizedMemberDetailsDTO);



            }
            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }



        }








        [HttpPut]
        [Route("Updateprofile/{userId}")]
        public HttpResponseMessage UpdateProfile(ProfileDetailsDTO profileDetailsDTO, int userId)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            Member member = db.Members.Where(x => x.id == userId).FirstOrDefault();

            try
            {

                if (profileDetailsDTO.unixDate == null)
                {
                    member.city = profileDetailsDTO.city;
                    member.biography = profileDetailsDTO.bio;
                    member.occupation = profileDetailsDTO.occupation;
                    member.gender = profileDetailsDTO.gender;
                    member.pictureUrl = profileDetailsDTO.pictureUrl;
                }
                else
                {
                    member.city = profileDetailsDTO.city;
                    member.biography = profileDetailsDTO.bio;
                    member.occupation = profileDetailsDTO.occupation;
                    member.gender = profileDetailsDTO.gender;
                    member.pictureUrl = profileDetailsDTO.pictureUrl;
                    member.dateOfBirth = profileDetailsDTO.unixDate;
                }

                if (profileDetailsDTO.hobbies != null)
                {
                    foreach (MembersHobby hobby in db.MembersHobbies.Where(x => x.memberId == userId))
                    {
                        MembersHobby membersHobby = hobby;
                        db.MembersHobbies.Remove(membersHobby);
                    }

                    foreach (HobbiesDTO hobby in profileDetailsDTO.hobbies)
                    {

                        MembersHobby hobbies = new MembersHobby();
                        hobbies.hobbyId = hobby.id;
                        hobbies.memberId = member.id;
                        db.MembersHobbies.Add(hobbies);

                    }
                }
                db.SaveChanges();


            }

            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

            return Request.CreateResponse(HttpStatusCode.OK, "Profile updated successfully");



        }

        [HttpPut]
        [Route("updatefeedsettings/{userId}")]
        public HttpResponseMessage UpdateFeedSettings(FeedSettingsDTO feedSettingsDTO, int userId)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            FeedSetting feedSetting = db.FeedSettings.Where(x => x.memberId == userId).FirstOrDefault();
            try
            {

                feedSetting.memberType = feedSettingsDTO.memberType;
                feedSetting.participantAgeRange = feedSettingsDTO.participantAgeRange;
                feedSetting.participantGender = feedSettingsDTO.participantGender;
                feedSetting.postLocation = feedSettingsDTO.postLocation;
                db.SaveChanges();

            }
            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
            return Request.CreateResponse(HttpStatusCode.OK, "Feed settings updated successfully!");


        }


















        [HttpGet]
        [Route("getmyprofile/{id}")]
        public HttpResponseMessage GetMyProfile(int id)
        {



            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {
                Member member = db.Members.SingleOrDefault(x => x.id == id);
                int unixDateOfBirth = (int)member.dateOfBirth;
                DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                dtDateTime = dtDateTime.AddSeconds(unixDateOfBirth).ToLocalTime();
                var today = DateTime.Today;
                // Calculate the age.
                int age = today.Year - dtDateTime.Year;
                // Go back to the year in which the person was born in case of a leap year
                if (dtDateTime.Date > today.AddYears(-age)) { age--; }
                string dateOfBirth = dtDateTime.ToString();
                string dateOfBirthLabel = dateOfBirth.Substring(0, dateOfBirth.IndexOf(" "));





                ProfileDetailsDTO profileDetailsDTO = new ProfileDetailsDTO()
                {
                    pictureUrl = member.pictureUrl,
                    fullName = member.fullName,
                    age = age,
                    city = member.city,
                    occupation = member.occupation,
                    bio = member.biography,
                    gender = member.gender,
                    dateOfBirth = dateOfBirthLabel,


                    hobbies = db.MembersHobbies.Where(h => h.memberId == member.id).Select(z => new HobbiesDTO
                    {
                        name = z.Hobby.name
                    }).ToList()

                };

                var ratings = db.Reviews.Where(x => x.memberId == id).ToList();

                double rating = 0;
                double ratingSum = 0;
                int numOfRatings = ratings.Count();

                if (ratings.Count() > 0)
                {

                    foreach (var r in ratings)
                    {
                        ratingSum += (int)r.stars;
                    };

                    rating = ratingSum / (double)ratings.Count();
                    rating = Math.Round(rating, 1);
                    profileDetailsDTO.rating = rating;
                    profileDetailsDTO.reviewsCount = ratings.Count();

                    //CHECK IF GOLD MEMBER

                    if (ratings.Count() >= 5 && rating > 4)
                    {
                        profileDetailsDTO.goldMember = true;
                    }
                    else
                    {
                        profileDetailsDTO.goldMember = false;
                    }


                }



                return Request.CreateResponse(HttpStatusCode.OK, profileDetailsDTO);
                /*       return Request.CreateResponse(HttpStatusCode.OK, rating);*/





            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);


            }




        }



        [HttpPost]
        [Route("addreview")]
        public HttpResponseMessage AddReview(ReviewsDTO reviewsDTO)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
                Review review = new Review
                {
                    fromMemberId = reviewsDTO.fromMemberId,
                    memberId = reviewsDTO.memberId,
                    text = reviewsDTO.text,
                    url = reviewsDTO.url,
                    stars = reviewsDTO.stars
                };

                db.Reviews.Add(review);
                db.SaveChanges();




            }
            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
            return Request.CreateResponse(HttpStatusCode.OK, "Review added");
        }




        [HttpGet]
        [Route("getallreviews/{memberId}")]
        public HttpResponseMessage GetAllReviews(int memberId)
        {



            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            List<ReviewsDTO> reviews = db.Reviews.Where(x => x.memberId == memberId).Select(y => new ReviewsDTO
            {
                fromMemberId = (int)y.fromMemberId,
                otherMemberImage = db.Members.Where(x => x.id == (int)y.fromMemberId).FirstOrDefault().pictureUrl,
                otherMemberName = db.Members.Where(x => x.id == (int)y.fromMemberId).FirstOrDefault().fullName,
                text = y.text,
                stars = (int)y.stars,
                id = y.id
            }).ToList();
            try
            {




                return Request.CreateResponse(HttpStatusCode.OK, reviews);



            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

        }









        [HttpGet]
        [Route("getmembersbysearchword/{searchWord}")]
        public HttpResponseMessage GetMembersBySearchWord(string searchWord)
        {



            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
                var usersWIthSearchWord = db.Members.Where(x => x.fullName.Contains(searchWord)).ToList();
                List<ProfileDetailsDTO> usersToSend = new List<ProfileDetailsDTO>();
                foreach (Member m in usersWIthSearchWord)
                {



                    ProfileDetailsDTO profileDTO = new ProfileDetailsDTO()
                    {
                        fullName = m.fullName,

                        pictureUrl = m.pictureUrl,
                        memberId = m.id

                    };
                    usersToSend.Add(profileDTO);

                };





                return Request.CreateResponse(HttpStatusCode.OK, usersToSend);



            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

        }



        [HttpPost]
        [Route("setnotificationid/{memberId}/{notificationId}")]


        public HttpResponseMessage SetNotificationId(int memberId, string notificationId)
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {
                Member member = db.Members.Where(x => x.id == memberId).FirstOrDefault();
                member.notificationId = notificationId;
                db.SaveChanges();

            }
            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
            return Request.CreateResponse(HttpStatusCode.OK, "Notification ID Saved In DB");
        }





        [HttpGet]
        [Route("getnotificationid/{memberId}/")]


        public HttpResponseMessage GetNotificationId(int memberId)
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {
                Member member = db.Members.Where(x => x.id == memberId).FirstOrDefault();
                string pushNotificationId = member.notificationId;

                return Request.CreateResponse(HttpStatusCode.OK, pushNotificationId);

            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }





        [HttpPost]
        [Route("addNotification")]


        public HttpResponseMessage addNotification(NotificationDTO notificationDTO)
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();



            try
            {
                Notification notification = new Notification()
                {
                    memberId = notificationDTO.memberId,
                    otherMemberId = notificationDTO.otherMemberId,
                    notificationText = notificationDTO.notificationText,
                    notificationType = notificationDTO.notificationType,
                    unixdate = notificationDTO.unixdate

                };
                db.Notifications.Add(notification);
                db.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, "Notification Saved In DB");

            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }




        [HttpPost]
        [Route("getNotifications/{memberId}")]


        public HttpResponseMessage getNotifications(int memberId)
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();



            try
            {
                List<NotificationDTO> notifications = db.Notifications.Where(x => x.memberId == memberId).Select(y => new NotificationDTO()
                {
                    memberId = memberId,
                    otherMemberId = (int)y.otherMemberId,
                    notificationText = y.notificationText,
                    notificationType = y.notificationType,
                    notificationId = y.id,
                    unixdate = (int)y.unixdate


                }).ToList();

                foreach (NotificationDTO notification in notifications)
                {
                    string memberImage = db.Members.Where(x => x.id == notification.otherMemberId).Select(y => y.pictureUrl).FirstOrDefault();
                    string memberName = db.Members.Where(x => x.id == notification.otherMemberId).Select(y => y.fullName).FirstOrDefault();

                    notification.otherMemberName = memberName;
                    notification.otherMemberImage = memberImage;







                    int lastUnixDate = notification.unixdate;

                    DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                    dtDateTime = dtDateTime.AddSeconds(lastUnixDate).ToLocalTime();

                    //Checking if last notification was sent over the last 24 hrs
                    string notificationDate;
                    DateTime now = DateTime.Now;
                    if (dtDateTime > now.AddHours(-24) && dtDateTime <= now)
                    {
                        decimal hours = Math.Floor((decimal)(now - dtDateTime).TotalHours);
                        int hoursDiffInt = (int)hours;
                        if (hoursDiffInt == 0)
                        {
                            notificationDate = (now - dtDateTime).Minutes.ToString();
                            if (notificationDate == "0")
                            {
                                notificationDate = "Now";
                            }
                            else
                            {
                                notificationDate += " min ago";
                            }

                        }
                        else
                        {

                            notificationDate = $"{hoursDiffInt}h ago";
                        }

                    }
                    else
                    {
                        string year = dtDateTime.Year.ToString();
                        string month = dtDateTime.Month.ToString();
                        string day = dtDateTime.Day.ToString();
                        notificationDate = $"{day}/{month}/{year}";

                    };

                    notification.notificationDate = notificationDate;

                }


                List<NotificationDTO> sortedNotificationList = notifications.OrderByDescending(o => o.unixdate).ToList();

                return Request.CreateResponse(HttpStatusCode.OK, sortedNotificationList);

            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }



        [HttpDelete]
        [Route("deletenotification/{notificationId}")]


        public HttpResponseMessage DeleteNotification(int notificationId)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
                Notification notification = db.Notifications.Where(x => x.id == notificationId).FirstOrDefault();

                db.Notifications.Remove(notification);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Notification Deleted");

            }
            catch (Exception)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }


        [HttpPost]
        [Route("addInteractionMember")]


        public HttpResponseMessage AddInteractionMember(InteractionMemberDTO interactionMemberDTO)
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();


            int strength = 0;

            switch (interactionMemberDTO.type)
            {

                case "Profile":
                    strength = 10;
                    break;
                case "Review 1":
                    strength = -50;
                    break;
                case "Review 2":
                    strength = -10;
                    break;
                case "Review 3":
                    strength = 0;
                    break;
                case "Review 4":
                    strength = 10;
                    break;
                case "Review 5":
                    strength = 50;
                    break;
                default:
                    break;
            }
            try
            {
                InteractionsMember interactionsMember = db.InteractionsMembers.Where
                    (x => x.memberId == interactionMemberDTO.memberId && x.otherMemberId == interactionMemberDTO.otherMemberId).FirstOrDefault();


                if (interactionsMember == null)
                {
                    InteractionsMember interaction = new InteractionsMember()
                    {
                        memberId = interactionMemberDTO.memberId,
                        otherMemberId = interactionMemberDTO.otherMemberId,
                        strength = strength
                    };
                    db.InteractionsMembers.Add(interaction);
                }
                else
                {
                    interactionsMember.strength += strength;
                };

                db.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, "Member strength updated");

            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }


        [HttpPost]
        [Route("addcurrentlocation/{memberId}/{lat}/{lng}")]

        public HttpResponseMessage AddCurrentLocation(int memberId, double lat, double lng)
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();


            try
            {
                Member member = db.Members.Where(x => x.id == memberId).FirstOrDefault();
                member.lastLocationLat = lat;
                member.lastLocationLong = lng;

                db.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, "Current location updated");

            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }




        [HttpPost]
        [Route("addMeetingSkipped/{memberId}")]


        public HttpResponseMessage AddMeetingSkipped(int memberId)
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();



            try
            {

                Member member = db.Members.Where(x => x.id == memberId).FirstOrDefault();
                if (member.numMeetingsSkipped >= 2)
                {
                    //TO ADD:
                    //PDF TO MAIL THAT ACCOUNT IS BLOCKED SINCE SKIPPED 3 MEETINGS
                    //DELETE MEMBER FROM DB
                    member.numMeetingsSkipped += 1;
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Member account is now blocked - deleted from db and sent pdf to mail with details");
                }
                else if (member.numMeetingsSkipped == null)
                {
                    member.numMeetingsSkipped = 1;
                }
                else
                {
                    member.numMeetingsSkipped += 1;

                }

                db.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, "One skipped meeting was added ");

            }

            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }



















        [HttpGet]
        [Route("timertest")]


        public HttpResponseMessage CheckMeetings()

        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            /* Test();*/
            try
            {
                var meetings = db.Meetings.ToList();
                foreach (var meeting in meetings)
                {
                    if (CheckIfShouldSendPush((int)meeting.meetingUnixDate))
                    {
                        Member firstMember = db.Members.Where(x => x.id == meeting.firstMemberId).FirstOrDefault();
                        SendPush(firstMember.notificationId);
                        Member secondMember = db.Members.Where(x => x.id == meeting.secondMemberId).FirstOrDefault();
                        SendPush(secondMember.notificationId);
                        //Add Notification To DB 

                        Notification firstNotification = new Notification()
                        {
                            memberId = firstMember.id,
                            notificationType = "meetingCheck",
                            otherMemberId = secondMember.id,
                            notificationText = $"Did you eventually meet {secondMember.fullName} for {meeting.meetingEventTitle}?",
                            unixdate = (int)DateTimeOffset.Now.ToUnixTimeSeconds(),
                        };
                        Notification secondNotification = new Notification()
                        {
                            memberId = secondMember.id,
                            notificationType = "meetingCheck",
                            otherMemberId = firstMember.id,
                            notificationText = $"Did you eventually meet {firstMember.fullName} for {meeting.meetingEventTitle}?",
                            unixdate = (int)DateTimeOffset.Now.ToUnixTimeSeconds(),
                        };


                        db.Notifications.Add(firstNotification);
                        db.Notifications.Add(secondNotification);



                        //DELETE MEETING FROM DB and adding notification to db
                        Meeting meetingTORemove = db.Meetings.Where(x => x.id == meeting.id).FirstOrDefault();
                        db.Meetings.Remove(meetingTORemove);





                    }

                }
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Success");
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, e.Message);
                throw;
            }

            /* long now = DateTimeOffset.Now.ToUnixTimeSeconds();*/
            // here i will check all upcoimg meetings - if meetings passed 3 days - i will sendpush() for both users - and add notification of meetingCheck to both users
        }






        public static bool CheckIfShouldSendPush(int meetingDate)
        {
            DateTime now = DateTime.Now;
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(meetingDate).ToLocalTime();
            double daysPassedFromMeeting = (now - dtDateTime).TotalDays;
            /* long noww = DateTimeOffset.Now.ToUnixTimeSeconds();*/
            if (daysPassedFromMeeting >= 3)
            {
                return true;
            }
            return false;
        }

        public static void SendPush(string notificationId)
        {
            if (notificationId == null)
            {
                return;
            }
            // Create a request using a URL that can receive a post.   
            WebRequest request = WebRequest.Create("https://exp.host/--/api/v2/push/send");
            // Set the Method property of the request to POST.  
            request.Method = "POST";
            // Create POST data and convert it to a byte array. 
            var objectToSend = new
            {
                to = notificationId,
                title = "Meeting check title",
                body = "Meeting check body",
                /*badge = 7,*/
                /*data = new { name = "nir", grade = 100, seconds = DateTime.Now.Second }*/
                data = new { functionToRun = "meetingCheck" }
            };

            string postData = new JavaScriptSerializer().Serialize(objectToSend);

            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            // Set the ContentType property of the WebRequest.  
            request.ContentType = "application/json";
            // Set the ContentLength property of the WebRequest.  
            request.ContentLength = byteArray.Length;
            // Get the request stream.  
            Stream dataStream = request.GetRequestStream();
            // Write the data to the request stream.  
            dataStream.Write(byteArray, 0, byteArray.Length);
            // Close the Stream object.  
            dataStream.Close();
            // Get the response.  
            WebResponse response = request.GetResponse();
            // Display the status.  
            string returnStatus = ((HttpWebResponse)response).StatusDescription;
            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.  
            dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.  
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.  
            string responseFromServer = reader.ReadToEnd();
            // Display the content.  
            //Console.WriteLine(responseFromServer);
            // Clean up the streams.  
            reader.Close();
            dataStream.Close();
            response.Close();

            /* return "success:) --- " + responseFromServer + ", " + returnStatus;*/

        }







        // POST api/<controller>
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}