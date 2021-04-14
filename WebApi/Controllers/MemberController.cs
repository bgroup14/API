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


                return Request.CreateResponse(HttpStatusCode.OK, profileDetailsDTO);





            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");


            }




        }



        [HttpPost]
        [Route("addreview")]
        public HttpResponseMessage AddReview(ReviewsDTO reviewsDTO)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
                Review review = new Review();
                review.fromMemberId = reviewsDTO.fromMemberId;
                review.toMemberId = reviewsDTO.toMemberId;
                review.text = reviewsDTO.text;
                review.url = reviewsDTO.url;
                review.stars = reviewsDTO.stars;

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