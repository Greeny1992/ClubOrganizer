using ClubOrganizerAPI.RequestModels;
using ClubOrganizerAPI.ResponseModels;
using Context;
using Context.DAL;
using Context.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ClubOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;
        Authentication auth = MonitoringFacade.Instance.Authentication;

        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginResponse))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginCredentials cred)
        {
            User usr = await mongo.User.Login(cred.Username, cred.Password);
            AuthenticationInformation token = await auth.Authenticate(usr);

            if (token != null)
            {
                LoginResponse returnmodel = new LoginResponse();
                returnmodel.User = usr;
                returnmodel.AuthenticationInformation = token;
                return returnmodel;
            }

            return Unauthorized();
        }


        [HttpPost("CreateUser")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<User>> CreateUser([Required][FromBody] User cred)
        {


            User usr = await mongo.User.InsertOrUpdateOneAsync(cred);


            if (usr != null)
            {


                return usr;
            }
            else
            {
                return NotFound();
            }

        }


        [HttpGet("ListUsers")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<List<User>>> ListUsers()
        {


            List<User> usr = mongo.User.FilterBy(x => true).ToList();


            if (usr != null)
            {


                return usr;
            }
            else
            {
                return NotFound();
            }

        }


        [HttpGet("GetUser")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(User))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<User>> GetUser([Required][FromQuery] String id)
        {


            User usr = await mongo.User.FindByIdAsync(id);


            if (usr != null)
            {


                return usr;
            }
            else
            {
                return NotFound();
            }

        }
    }
}
