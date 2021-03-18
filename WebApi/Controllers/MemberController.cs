using System;
using System.Collections.Generic;
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
            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();

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
                    meetingLocation = x.postLocation
                 
                });



                return Request.CreateResponse(HttpStatusCode.OK, AuthorizedMemberDetails);

            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }

        }



        [HttpPost]
        [Route("checkifmemberexists")]


        public HttpResponseMessage CheckIfMemberExists(MemberLoginDTO memberLogin)
        {
            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();

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
                        meetingLocation = x.postLocation


                    });


                    return Request.CreateResponse(HttpStatusCode.OK, AuthorizedMemberDetails);
                }



                return Request.CreateResponse(HttpStatusCode.BadRequest, "User dosent exists");

            }
            catch (Exception)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }

        }




        [HttpPost]
        [Route("register")]
        public HttpResponseMessage Register(MemberSignupDTO memberSignupDTO)
        {
            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();
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
                    meetingLocation = memberSignupDTO.feedSettings.postLocation
                };

                return Request.CreateResponse(HttpStatusCode.OK, authorizedMemberDetailsDTO);

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