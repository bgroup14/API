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
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
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
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Login success");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
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
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
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
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "checkifmemberexists Value saved in DB");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
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
                /* db.SaveChanges();*/






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
            catch (Exception ex)
            {
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
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
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Value saved in DB");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
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
                return Request.CreateResponse(HttpStatusCode.OK, "Profile updated successfully");

            }
            catch (Exception ex)
            {
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
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
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Profile updated successfully");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }

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
                return Request.CreateResponse(HttpStatusCode.OK, "Feed settings updated successfully");
            }
            catch (Exception ex)
            {
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
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
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Feed settings updated successfully");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
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
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
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
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "getmyprofile Value saved in DB");

                }

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
                

                return Request.CreateResponse(HttpStatusCode.OK, "Review added");

            }
            catch (Exception ex)
            {
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
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
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Review added");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }

        }














        [HttpGet]
        [Route("getmembersbysearchword/{searchWord}")]
        public HttpResponseMessage GetMembersBySearchWord(string searchWord)
        {



            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try {
                var usersWIthSearchWord = db.Members.Where(x => x.fullName.Contains(searchWord)).ToList();
                List<ProfileDetailsDTO> usersToSend = new List<ProfileDetailsDTO>();
                foreach (Member m in usersWIthSearchWord)
                {

                    //calculate age
                    /*int unixDateOfBirth = (int)m.dateOfBirth;
                    DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                    dtDateTime = dtDateTime.AddSeconds(unixDateOfBirth).ToLocalTime();
                    var today = DateTime.Today;
                    // Calculate the age.
                    int age = today.Year - dtDateTime.Year;
                    // Go back to the year in which the person was born in case of a leap year
                    if (dtDateTime.Date > today.AddYears(-age)) { age--; }*/

                    ProfileDetailsDTO profileDTO = new ProfileDetailsDTO()
                    {
                        fullName=m.fullName,
                        /*age = age,*/
                        pictureUrl = m.pictureUrl,
                        memberId=m.id

                    };
                    usersToSend.Add(profileDTO);

                };





                return Request.CreateResponse(HttpStatusCode.OK, usersToSend);



            }
            catch (Exception ex)
            {
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
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
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "getmembersbysearchword Value saved in DB");

                }

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