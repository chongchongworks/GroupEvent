<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match ="Customers">
    <Customers>
      <xsl:apply-templates select ="Customer"/>
    </Customers>
  </xsl:template>
  <xsl:template match ="Customer">
    <Customer>
      <xsl:attribute name="WechatName">
        <xsl:value-of select="WechatName"/>
      </xsl:attribute>
      <xsl:attribute name="Email">
        <xsl:value-of select="Email"/>
      </xsl:attribute>
      <xsl:attribute name="NumberOfPeople">
        <xsl:value-of select="NumberOfPeople"/>
      </xsl:attribute>
      <xsl:attribute name="RealName">
        <xsl:value-of select="RealName"/>
      </xsl:attribute>
      <xsl:attribute name="Mobile">
        <xsl:value-of select="Mobile"/>
      </xsl:attribute>
      <xsl:attribute name="Paid">
        <xsl:value-of select="Paid"/>
      </xsl:attribute>
		<xsl:attribute name="Accommodation">
			<xsl:value-of select="Accommodation"/>
		</xsl:attribute>
		<xsl:attribute name="Desc">
			<xsl:value-of select="Desc"/>
		</xsl:attribute>
		<xsl:attribute name="Guid">
			<xsl:value-of select="Guid"/>
		</xsl:attribute>
    </Customer>
  </xsl:template>
</xsl:stylesheet>