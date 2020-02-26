import React from 'react'
import SignatureCanvas from 'react-signature-canvas'
import styled from 'styled-components'

const Label = styled.div`
  font-size: 12px;
  color: rgba(30, 134, 218, 0.918);;
`

const BottomLine = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.26);
  width: 500px;
`

export const Signature = () => <div>
  <Label>Signature</Label>
  <BottomLine>
    <SignatureCanvas
      canvasProps={{width: 500, height: 200}}
    />
  </BottomLine>
</div>