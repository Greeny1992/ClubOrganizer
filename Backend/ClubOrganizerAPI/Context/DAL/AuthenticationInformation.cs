using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.DAL
{
    public class AuthenticationInformation
    {
        public String Token { get; set; }
        public long ExpirationDate { get; set; }
    }
}
