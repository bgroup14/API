using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Spatial;
using System.Data.Entity.Validation;
using System.Device.Location;
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
    [RoutePrefix("api/post")]
    public class PostController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }


        [HttpGet]
        [Route("getAllPosts")]

        public HttpResponseMessage GetAllPosts()
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {

                var posts = db.Posts.Select(x => new PostDTO()
                {
                    text = x.text,
                    fromAge = (int)x.fromAge,
                    toAge = (int)x.toAge,
                    helpType = x.helpType,
                    isZoom = x.isZoom,
                    unixDate = (int)x.unixDate,
                    recurring = x.recurring,
                    fromGender = x.fromGender,
                    longitude = (double)x.longitude,
                    latitude = (double)x.latitude,
                    timeOfDay = x.timeOfDay,
                    category = x.category,
                    member_id = (int)x.member_id,
                    cityName = x.cityName,
                    dateLabel = x.dateLabel,
                    postId = x.id,
                    postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                    postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                    comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                    {
                        commentingMemberId = (int)y.commentingMemberId,
                        commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                        commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                        text = y.text
                    }).ToList()



                }).ToList();





                return Request.CreateResponse(HttpStatusCode.OK, posts);
            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }


        }


        [HttpGet]
        [Route("getpostsbysearchword/{searchWord}")]

        public HttpResponseMessage GetPostsBySearchWord(string searchWord)
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {

                var postsWIthSearchWord = db.Posts.Where(x => x.text.Contains(searchWord)).ToList();
                List<PostDTO> postsToSend = new List<PostDTO>();

                foreach (Post x in postsWIthSearchWord)
                {
                    PostDTO postDTO = new PostDTO()
                    {
                        text = x.text,
                        fromAge = (int)x.fromAge,
                        toAge = (int)x.toAge,
                        helpType = x.helpType,
                        isZoom = x.isZoom,
                        unixDate = (int)x.unixDate,
                        recurring = x.recurring,
                        fromGender = x.fromGender,
                        longitude = (double)x.longitude,
                        latitude = (double)x.latitude,
                        timeOfDay = x.timeOfDay,
                        category = x.category,
                        member_id = (int)x.member_id,
                        cityName = x.cityName,
                        dateLabel = x.dateLabel,
                        postId = x.id,
                        postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                        postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                        comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                        {
                            commentingMemberId = (int)y.commentingMemberId,
                            commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                            commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                            text = y.text
                        }).ToList()


                    };
                    postsToSend.Add(postDTO);

                }




                return Request.CreateResponse(HttpStatusCode.OK, postsToSend);

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
        [Route("getuserposts/{id}")]

        public HttpResponseMessage GetUserPosts(int id)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {

                var posts = db.Posts.Where(p => p.member_id == id).Select(x => new PostDTO()
                {

                    text = x.text,
                    fromAge = (int)x.fromAge,
                    toAge = (int)x.toAge,
                    helpType = x.helpType,
                    isZoom = x.isZoom,
                    unixDate = (int)x.unixDate,
                    recurring = x.recurring,
                    fromGender = x.fromGender,
                    longitude = (double)x.longitude,
                    latitude = (double)x.latitude,
                    timeOfDay = x.timeOfDay,
                    category = x.category,
                    member_id = (int)x.member_id,
                    cityName = x.cityName,
                    dateLabel = x.dateLabel,
                    postId = x.id,
                    postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                    postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                    comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                    {
                        commentingMemberId = (int)y.commentingMemberId,
                        commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                        commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                        text = y.text
                    }).ToList()


                }).ToList();

                return Request.CreateResponse(HttpStatusCode.OK, posts);
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
        [Route("getPostsFromCategry/{categoryId}")]

        public HttpResponseMessage getPostsFromCategry(string categoryId)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {

                var posts = db.Posts.Select(x => new PostDTO()
                {
                    text = x.text,
                    fromAge = (int)x.fromAge,
                    toAge = (int)x.toAge,
                    helpType = x.helpType,
                    isZoom = x.isZoom,
                    unixDate = (int)x.unixDate,
                    recurring = x.recurring,
                    fromGender = x.fromGender,
                    longitude = (double)x.longitude,
                    latitude = (double)x.latitude,
                    timeOfDay = x.timeOfDay,
                    category = x.category,
                    member_id = (int)x.member_id,
                    cityName = x.cityName,
                    dateLabel = x.dateLabel,
                    postId = x.id,
                    postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                    postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                    comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                    {
                        commentingMemberId = (int)y.commentingMemberId,
                        commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                        commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                        text = y.text
                    }).ToList()



                }).Where(y => y.category == categoryId).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, posts);
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
                    return Request.CreateResponse(HttpStatusCode.OK, "getPostsFromCategry Value saved in DB");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }

        [HttpGet]
        [Route("getPostsDateAscending")]

        public HttpResponseMessage getPostsDateAscending()
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {

                var posts = db.Posts.Select(x => new PostDTO()
                {
                    text = x.text,
                    fromAge = (int)x.fromAge,
                    toAge = (int)x.toAge,
                    helpType = x.helpType,
                    isZoom = x.isZoom,
                    unixDate = (int)x.unixDate,
                    recurring = x.recurring,
                    fromGender = x.fromGender,
                    longitude = (double)x.longitude,
                    latitude = (double)x.latitude,
                    timeOfDay = x.timeOfDay,
                    category = x.category,
                    member_id = (int)x.member_id,
                    cityName = x.cityName,
                    dateLabel = x.dateLabel,
                    postId = x.id,
                    postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                    postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                    comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                    {
                        commentingMemberId = (int)y.commentingMemberId,
                        commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                        commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                        text = y.text
                    }).ToList()



                }).OrderBy(y => y.unixDate).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, posts);
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
                    return Request.CreateResponse(HttpStatusCode.OK, "getPostsDateAscending Value saved in DB");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }


        [HttpGet]
        [Route("getPostsDateDescending")]

        public HttpResponseMessage getPostsDateDescending()
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {
                /*  string list = db.Members.Where(y => y.id == 157).First().fullName;*/
                var posts = db.Posts.Select(x => new PostDTO()
                {
                    text = x.text,
                    fromAge = (int)x.fromAge,
                    toAge = (int)x.toAge,
                    helpType = x.helpType,
                    isZoom = x.isZoom,
                    unixDate = (int)x.unixDate,
                    recurring = x.recurring,
                    fromGender = x.fromGender,
                    longitude = (double)x.longitude,
                    latitude = (double)x.latitude,
                    timeOfDay = x.timeOfDay,
                    category = x.category,
                    member_id = (int)x.member_id,
                    cityName = x.cityName,
                    dateLabel = x.dateLabel,
                    postId = x.id,
                    postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                    postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                    comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                    {
                        commentingMemberId = (int)y.commentingMemberId,
                        commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                        commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                        text = y.text
                    }).ToList()



                }).OrderByDescending(y => y.unixDate).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, posts);
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
                    return Request.CreateResponse(HttpStatusCode.OK, "getPostsDateDescending Value saved in DB");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }


        [HttpPost]
        [Route("getFilteredPosts/{memberId}")]

        /*public List<PostDTO> GetFilteredPosts(FeedFilterDTO filterDTO, int memberId)*/
        public HttpResponseMessage GetFilteredPosts(FeedFilterDTO filterDTO, int memberId)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {


                FeedSettingsDTO feedSettings = db.FeedSettings.Where(m => m.memberId == memberId).Select(x => new FeedSettingsDTO()
                {
                    memberType = x.memberType,
                    postLocation = x.postLocation,
                    participantGender = x.participantGender,
                    participantAgeRange = x.participantAgeRange
                }).FirstOrDefault();

                double myLong = 0;
                double myLat = 0;
                if (filterDTO != null)
                {
                    myLong = filterDTO.meetingLocationLong;
                    myLat = filterDTO.meetingLocationLat;
                }


                var filteredPosts = db.Posts.Where(p => p.member_id != memberId).Select(x => new PostDTO()
                {
                    text = x.text,
                    fromAge = (int)x.fromAge,
                    toAge = (int)x.toAge,
                    helpType = x.helpType,
                    isZoom = x.isZoom,
                    unixDate = (int)x.unixDate,
                    recurring = x.recurring,
                    fromGender = x.fromGender,
                    longitude = (double)x.longitude,
                    latitude = (double)x.latitude,
                    timeOfDay = x.timeOfDay,
                    category = x.category,
                    member_id = (int)x.member_id,
                    cityName = x.cityName,
                    dateLabel = x.dateLabel,
                    postId = x.id,
                    postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                    postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,
                    authorGender = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().gender,

                    comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                    {
                        commentingMemberId = (int)y.commentingMemberId,
                        commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                        commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                        text = y.text
                    }).ToList(),

                    distanceFromMe = (double)(12742 * (double)System.Data.Entity.SqlServer.SqlFunctions.Asin(System.Data.Entity.SqlServer.SqlFunctions.SquareRoot((double)(0.5 - System.Data.Entity.SqlServer.SqlFunctions.Cos((double)(myLat - (double)x.latitude) * 0.017453292519943295) / 2 + System.Data.Entity.SqlServer.SqlFunctions.Cos((double)x.latitude * 0.017453292519943295) * System.Data.Entity.SqlServer.SqlFunctions.Cos((double)myLat * 0.017453292519943295) * (1 - System.Data.Entity.SqlServer.SqlFunctions.Cos((myLong - (double)x.longitude) * 0.017453292519943295)) / 2    )))) // 2 * R; R = 6371 km
                //distanceFromMe = (double)System.Data.Entity.SqlServer.SqlFunctions.SquareRoot((double)9)
                //distanceFromMe = (double)((x.latitude - filterDTO.meetingLocationLat) * (x.latitude - filterDTO.meetingLocationLat) + (x.longitude - filterDTO.meetingLocationLong) * (x.longitude - filterDTO.meetingLocationLong))
                /*Coordinates = db.Posts.Where(z => z.id == x.id).Select(z => new GeoCoordinate(){
                    Latitude = (double)z.latitude,
                    Longitude = (double)z.longitude
                }).ToList()*/

            });

                //return Request.CreateResponse(HttpStatusCode.OK, filteredPosts);

                string categoryName = null;
                if (filterDTO != null && filterDTO.categoryName != null)
                {
                    categoryName = filterDTO.categoryName;
                }









                if (filterDTO != null && filterDTO.userType != null) // IT MEANS WE HAVE FILTER ACTIVATED
                {
                    // meetingLocation
                    if (filterDTO.meetingLocation != null)
                    {
                        if (filterDTO.meetingLocation.Equals("Zoom Only"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.isZoom == true);
                        }
                        else if (filterDTO.meetingLocation.Equals("My Area"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.distanceFromMe <= 5);
                            //filteredPosts = filteredPosts.Where(x => new GeoCoordinate(x.latitude, x.longitude).GetDistanceTo(userLocation) <= 5);
                        }
                        else if (filterDTO.meetingLocation.Equals("30KM"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.distanceFromMe <= 30);
                            //filteredPosts = filteredPosts.Where(x => new GeoCoordinate(x.latitude, x.longitude).GetDistanceTo(userLocation) <= 30);
                        }
                    }

                    //userType
                    if (filterDTO.userType != null)
                    {
                        /*if (filterDTO.userType.Equals("Need Help"))*/
                        if (filterDTO.userType == "Need Help")
                        {
                            /*filteredPosts = filteredPosts.Where(m => m.helpType.Equals("Give Help"));*/
                            filteredPosts = filteredPosts.Where(m => m.helpType == "Give Help");
                        }
                        /* else if (filterDTO.userType.Equals("Give Help"))*/
                        else if (filterDTO.userType == "Give Help")
                        {
                            /*filteredPosts = filteredPosts.Where(m => m.helpType.Equals("Need Help"));*/
                            filteredPosts = filteredPosts.Where(m => m.helpType == "Need Help");
                        }
                    }


                    //participantAge
                    if (filterDTO.participantAge != null)
                    {
                        switch (filterDTO.participantAge)
                        {
                            case "16-30":
                                filteredPosts = filteredPosts.Where(m => m.fromAge >= 16 && m.toAge <= 30);
                                break;
                            case "30-50":
                                filteredPosts = filteredPosts.Where(m => m.fromAge >= 30 && m.toAge <= 50);
                                break;
                            case "50+":
                                filteredPosts = filteredPosts.Where(m => m.fromAge >= 50 && m.toAge <= 999);
                                break;
                            default:
                                break;

                        }
                    }


                    //participantGender
                    if (filterDTO.participantGender != null)
                    {
                        if (filterDTO.participantGender.Equals("Man") || filterDTO.participantGender.Equals("Woman"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.fromGender.Equals(filterDTO.participantGender));
                        }
                    }


                    //categoryName
                    if (filterDTO.categoryName != null)
                    {
                        if (!filterDTO.categoryName.Equals("null"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.category.Equals(filterDTO.categoryName));
                        }
                    }
                    if (categoryName != null)
                    {
                        if (!categoryName.Equals("null"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.category.Equals(categoryName));
                        }
                    }

                    //sortBy
                    if (filterDTO.sortBy != null)
                    {
                        switch (filterDTO.sortBy)
                        {
                            case "Relevance":
                                //Need to setup smart element
                                break;
                            case "Location":
                                filteredPosts = filteredPosts.OrderBy(y => y.distanceFromMe);
                                break;
                            case "Meeting date":
                                filteredPosts = filteredPosts.OrderByDescending(y => y.unixDate);
                                break;
                            default:
                                break;
                        }
                    }

                }
                else /*if (feedSettings != null)*/
                {
                    if (feedSettings.memberType != null)
                    {
                        // meetingLocation
                        // Show 30KM radius by default
                        //filteredPosts = filteredPosts.Where(m => m.distanceFromMe <= 30);

                        //userType
                        if (feedSettings.memberType == "Need Help")
                        {
                            filteredPosts = filteredPosts.Where(m => m.helpType.Equals("Give Help"));
                        }
                        else if (feedSettings.memberType.Equals("Give Help"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.helpType.Equals("Need Help"));

                        }

                        //participantAge
                        if (feedSettings.participantAgeRange != null)
                        {
                            switch (feedSettings.participantAgeRange)
                            {
                                case "16-30":
                                    filteredPosts = filteredPosts.Where(m => m.fromAge >= 16 && m.toAge <= 30);
                                    break;
                                case "30-50":
                                    filteredPosts = filteredPosts.Where(m => m.fromAge >= 30 && m.toAge <= 50);
                                    break;
                                case "50+":
                                    filteredPosts = filteredPosts.Where(m => m.fromAge >= 50 && m.toAge <= 999);
                                    break;
                                default:
                                    break;

                            }
                        }


                        //participantGender
                        if (feedSettings.participantGender != null)
                        {
                            if (feedSettings.participantGender.Equals("Man") || feedSettings.participantGender.Equals("Woman"))
                            {
                                //Offek: Alan please check this
                                if (feedSettings.memberType == "Need Help")
                                {
                                    filteredPosts = filteredPosts.Where(m => m.authorGender.Equals(feedSettings.participantGender));
                                }
                                else 
                                {
                                    filteredPosts = filteredPosts.Where(m => m.fromGender.Equals(feedSettings.participantGender));
                                }
                            }
                        }

                        //categoryName
                        if (categoryName != null)
                        {
                            if (!categoryName.Equals("null"))
                            {
                                filteredPosts = filteredPosts.Where(m => m.category.Equals(categoryName));
                            }
                        }





                    }

                }
                return Request.CreateResponse(HttpStatusCode.OK, filteredPosts);
                /* return filteredPosts.ToList();*/
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





        // POST api/<controller>


        [HttpPost]
        [Route("publishpost")]
        public HttpResponseMessage PublishPost(PostDTO postDTO)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {

                Post newPost = new Post()
                {
                    text = postDTO.text,
                    fromAge = postDTO.fromAge,
                    toAge = postDTO.toAge,
                    helpType = postDTO.helpType,
                    isZoom = postDTO.isZoom,
                    unixDate = postDTO.unixDate,
                    recurring = postDTO.recurring,
                    fromGender = postDTO.fromGender,
                    longitude = postDTO.longitude,
                    latitude = postDTO.latitude,
                    timeOfDay = postDTO.timeOfDay,
                    category = postDTO.category,
                    member_id = postDTO.member_id,
                    cityName = postDTO.cityName,
                    dateLabel = postDTO.dateLabel
                };
                db.Posts.Add(newPost);
                MembersPost newMembersPost = new MembersPost()
                {
                    postId = newPost.id,
                    memberId = postDTO.member_id
                };
                db.MembersPosts.Add(newMembersPost);
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

            return Request.CreateResponse(HttpStatusCode.OK, "Post saved in DB");


        }



        [HttpPost]
        [Route("publishcomment")]
        public HttpResponseMessage PublishComment(CommentDTO commentDTO)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
                Comment comment = new Comment()
                {
                    commentingMemberId = commentDTO.commentingMemberId,
                    postId = commentDTO.postId,
                    text = commentDTO.text
                };

                db.Comments.Add(comment);

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

            return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");



        }


        [HttpPost]
        [Route("publishlike")]
        public HttpResponseMessage PublishLike(LikeDTO likeDTO)
        {
            /*  return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");*/
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
                Like like = new Like()
                {
                    likingMemberId = likeDTO.likingMemberId,
                    postId = likeDTO.postId
                };

                db.Likes.Add(like);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Like saved success");
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
                    return Request.CreateResponse(HttpStatusCode.OK, "Like saved success");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }


        [HttpDelete]
        [Route("deletepost/{postId}")]
        public HttpResponseMessage DeletePost(int postId)
        {
            /*  return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");*/
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
                Post postToDelete = db.Posts.Where(x => x.id == postId).First();
                db.Posts.Remove(postToDelete);
                MembersPost membersPostToDelete = db.MembersPosts.Where(x => x.postId == postId).First();
                db.MembersPosts.Remove(membersPostToDelete);


                foreach (Comment comment in db.Comments)
                {
                    if (comment.postId == postId)
                    {
                        db.Comments.Remove(comment);
                    }
                }
                db.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, "Post deleted from DB");




            }
            catch (Exception ex)
            {
             

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }

        }


        [HttpDelete]
        [Route("deletelike/{postId}/{memberId}")]
        public HttpResponseMessage DeleteLike(int postId, int memberId)
        {
            /*  return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");*/
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
                Like likeToDelete = db.Likes.Where(x => x.postId == postId).Where(x => x.likingMemberId == memberId).FirstOrDefault();
                db.Likes.Remove(likeToDelete);

                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Like deleted");
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
                    return Request.CreateResponse(HttpStatusCode.OK, "Like deleted");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }

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

        /*double CalculateDistance(double longitudeA, double latitudeA, double longitudeB, double latitudeB)
        {
            if (longitudeA != 0 && latitudeA != 0 && longitudeA != 0 && longitudeB != 0)
            {
                var sCoord = new GeoCoordinate(longitudeA, latitudeA);
                var eCoord = new GeoCoordinate(longitudeB, latitudeB);

                return sCoord.GetDistanceTo(eCoord) / 1000;
            }

            return 0;

        }*/
    }
}