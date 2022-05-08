using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utilities
{
    public class Converter
    {
        public static int ConvertToInteger(Object text, int standard = 0)
        {
            int output;
            if (text != null && text.Equals(DBNull.Value) == false)
            {
                int number;

                if (int.TryParse(text + "", System.Globalization.NumberStyles.Any, CultureInfo.InvariantCulture, out number))
                {
                    output = number;
                }
                else
                {
                    output = standard;
                }
            }
            else
            {
                output = standard;
            }
            return output;
        }


        public static T ParseEnum<T>(string value)
        {


            return (T)Enum.Parse(typeof(T), value);


        }

        public static string Base64Encode(string path)
        {
            Byte[] bytes = File.ReadAllBytes(path);
            String file = Convert.ToBase64String(bytes);
            return file;
        }

        public static void Base64Decode(string file, string base64)
        {
            Byte[] bytes = Convert.FromBase64String(base64);
            File.WriteAllBytes(file, bytes);
        }



        public static Double ConvertToDouble(Object text, Double standard = 0)
        {
            Double number;
            Double output;
            if (text != null && text.Equals(DBNull.Value) == false)
            {
                String mytext = text + "";
                mytext = mytext.Replace(',', '.');
                if (Double.TryParse(mytext, System.Globalization.NumberStyles.Any, CultureInfo.InvariantCulture, out number))
                {
                    output = number;
                }
                else
                {
                    output = standard;
                }
            }
            else
            {
                output = standard;
            }
            return output;
        }



        public static short ConvertToShort(Object text, short standard = 0)
        {
            short number;
            short output;
            if (text != null && text.Equals(DBNull.Value) == false)
            {
                String mytext = text + "";
                mytext = mytext.Replace(',', '.');
                if (short.TryParse(mytext, System.Globalization.NumberStyles.Any, CultureInfo.InvariantCulture, out number))
                {
                    output = number;
                }
                else
                {
                    output = standard;
                }
            }
            else
            {
                output = standard;
            }
            return output;
        }


        public static long ConvertToLong(Object text, long standard = 0)
        {
            long number;
            long output;
            if (text != null && text.Equals(DBNull.Value) == false)
            {
                String mytext = text + "";
                mytext = mytext.Replace(',', '.');
                if (long.TryParse(mytext, System.Globalization.NumberStyles.Any, CultureInfo.InvariantCulture, out number))
                {
                    output = number;
                }
                else
                {
                    output = standard;
                }
            }
            else
            {
                output = standard;
            }
            return output;
        }

        public static Boolean ConvertToBoolean(Object text, Boolean standard = false)
        {
            Boolean number;
            Boolean output;

            if (text != null && text.Equals(DBNull.Value) == false)
            {
                if (Boolean.TryParse(text + "", out number))
                {
                    output = number;
                }
                else
                {
                    if (text.ToString().Trim().Equals("0"))
                    {
                        output = false;
                    }
                    else if (text.ToString().Trim().Equals("1"))
                    {
                        output = true;
                    }
                    else
                    {
                        output = standard;
                    }
                }
            }
            else
            {
                output = standard;
            }
            return output;
        }

        public static float ConvertToFloat(Object text, float standard = 0f)
        {
            float number;
            float output;

            if (text != null && text.Equals(DBNull.Value) == false)
            {
                if (float.TryParse(text + "", out number))
                {
                    output = number;
                }
                else
                {
                    output = standard;
                }
            }
            else
            {
                output = standard;
            }
            return output;
        }


        public static DateTime ConvertToDateTime(Object text)
        {
            DateTime output;
            DateTime date;
            if (DateTime.TryParse(text.ToString(), out date))
            {
                output = date;
            }
            else
            {
                output = DateTime.Now;
            }

            return output;
        }



        public static Boolean CanConvertToDouble(String text)
        {
            Double number;
            text = text.Replace(',', '.');
            if (Double.TryParse(text, System.Globalization.NumberStyles.Any, CultureInfo.InvariantCulture, out number))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static Boolean CanConvertToBoolean(String text)
        {
            bool boolean;
            if (bool.TryParse(text, out boolean))
            {
                return true;
            }
            return false;
        }

        public static Boolean CanConvertToInteger(String text)
        {
            int number;
            if (int.TryParse(text, System.Globalization.NumberStyles.Any, CultureInfo.InvariantCulture, out number))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static Boolean CanConvertToDateTime(String text)
        {
            DateTime date;
            if (DateTime.TryParse(text, out date))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static Boolean CanConvertToLong(Object value)
        {
            long val;

            if (long.TryParse(value + "", out val))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static long ConvertStringToLong(Object value, long standard = 0)
        {
            long output;
            long val;

            if (value != null && value.Equals(DBNull.Value) == false)
            {

                if (long.TryParse(value + "", out val))
                {
                    output = val;
                }
                else
                {
                    output = standard;
                }
            }
            else
            {
                output = standard;
            }

            return output;
        }




        public static long ConvertDateToUnixTimeStamp(DateTime d)
        {
            //var epoch = (d.Date - new DateTime(1970, 1, 1)).TotalSeconds;
            // return (long)epoch;

            TimeSpan span = d - new DateTime(1970, 1, 1);
            long returnval = (long)span.TotalSeconds;

            return returnval;
        }


        public static DateTime ConvertUnixTimeStampToDate(long timestamp)
        {
            var epoch = new DateTime(1970, 1, 1);
            return epoch.AddSeconds(timestamp);
        }
    }
}
