using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DATA;
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
            memberDTO.name = "My email is: " + member.email;
            return memberDTO.name;
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value test github!!!!";
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

                return Request.CreateResponse(HttpStatusCode.OK, "Login success");

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