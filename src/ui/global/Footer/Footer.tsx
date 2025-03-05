//* Import libraries
import React from "react";
import { Container, Box, Grid, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material";

//* Import interfaces
import { Link } from "@leanoncompany/supporti-react-ui";
import IFooterProps from "../../../@types/ui/global/footer";

const Footer = (props: IFooterProps) => {
  //* IFooterProps
  const themes = useTheme();

  return (
    <Box
      borderTop={`1px solid ${themes.palette.grey[300]}`}
      mt={7}
      pt={7}
      pb={7}
      {...props.wrapperBoxProps}
    >
      <Container>
        <Grid container rowSpacing={3}>
          {/* About */}
          <Grid item xs={12} sm={6}>
            {/* Term links */}
            {props.terms !== undefined && (
              <Box display={"flex"} mb={4}>
                {Object.values(props.terms).map((termValue) => (
                  <Link key={termValue.link} to={termValue.link} isNext={true}>
                    <Typography
                      variant={"body2"}
                      sx={{
                        mr: 2,
                        color: themes.palette.grey[700],
                        fontWeiht: 700,
                      }}
                    >
                      {termValue.label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            )}

            {/* Basic informations */}
            {props.information !== undefined && (
              <Box mb={2}>
                <Typography
                  variant={"body2"}
                  sx={{
                    color: themes.palette.grey[600],
                    fontWeight: 700,
                  }}
                >
                  {Object.values(props.information).map((informationValue) => (
                    <span
                      key={JSON.stringify(informationValue)}
                      style={{ marginRight: "10px" }}
                    >
                      <span
                        style={{
                          marginRight: "5px",
                        }}
                      >
                        {informationValue.label}
                      </span>

                      <span>{informationValue.value}</span>
                    </span>
                  ))}
                </Typography>
              </Box>
            )}

            {/* Copyright */}
            {props.copyright !== undefined && (
              <Box>
                <Typography
                  variant={"body2"}
                  sx={{
                    color: themes.palette.grey[600],
                    fontWeight: 700,
                  }}
                >
                  {`Copyright c ${props.copyright.foundingYear} ${props.copyright.name} Co., Ltd. All Rights Reserved.`}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Contacts */}
          <Grid item display={{ xs: "none", sm: "block" }} sm={6}>
            {props.contact !== undefined && (
              <Box
                display={"flex"}
                justifyContent={{
                  xs: undefined,
                  sm: "flex-end",
                }}
              >
                <Box>
                  {/* Title */}
                  <Box mb={0.5}>
                    <Typography
                      variant={"body1"}
                      sx={{
                        color: themes.palette.primary.main,
                        fontWeight: 700,
                      }}
                    >
                      고객센터
                    </Typography>
                  </Box>

                  {/* Phone */}
                  {props.contact.number !== undefined && (
                    <Box mb={1}>
                      <Typography
                        variant={"h4"}
                        sx={{
                          color: themes.palette.primary.main,
                          fontWeight: 700,
                        }}
                      >
                        {props.contact.number}
                      </Typography>
                    </Box>
                  )}

                  {/* Contact available time */}
                  <Box>
                    {/* Available time */}
                    {props.contact.availableTime !== undefined && (
                      <Box>
                        <Typography
                          variant={"body1"}
                          sx={{
                            color: themes.palette.grey[600],
                            fontWeight: 700,
                          }}
                        >
                          {props.contact.availableTime}
                        </Typography>
                      </Box>
                    )}

                    {/* Additional info of available time */}
                    {props.contact.additionalInfoOfAvailableTime !==
                      undefined && (
                      <Box>
                        <Typography
                          variant={"body2"}
                          sx={{
                            color: themes.palette.grey[600],
                            fontWeight: 700,
                          }}
                        >
                          {props.contact.additionalInfoOfAvailableTime}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
